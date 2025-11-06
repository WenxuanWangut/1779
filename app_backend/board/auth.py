"""
In-memory token authentication system.
Tokens are stored in memory and will be lost on server restart.
"""
import secrets
from functools import wraps
from rest_framework.response import Response
from .models import User

# In-memory token storage
# Format: {token: user_id}
_tokens = {}

# Format: {user_id: token} for quick user->token lookup
_user_tokens = {}


def generate_token():
    """Generate a secure random token."""
    return secrets.token_urlsafe(32)


def create_token(user):
    """
    Create a token for a user.
    If user already has a token, return the existing one.
    """
    user_id = str(user.id)
    
    # Check if user already has a token
    if user_id in _user_tokens:
        return _user_tokens[user_id]
    
    # Generate new token
    token = generate_token()
    _tokens[token] = user_id
    _user_tokens[user_id] = token
    
    return token


def get_user_from_token(token):
    """
    Get user from token.
    Returns User object or None if token is invalid.
    """
    user_id = _tokens.get(token)
    if not user_id:
        return None
    
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        # Token exists but user doesn't - clean up
        delete_token(token)
        return None


def delete_token(token):
    """Delete a token (logout)."""
    user_id = _tokens.pop(token, None)
    if user_id:
        _user_tokens.pop(user_id, None)


def delete_user_tokens(user_id):
    """Delete all tokens for a user."""
    user_id = str(user_id)
    token = _user_tokens.pop(user_id, None)
    if token:
        _tokens.pop(token, None)


def get_active_tokens_count():
    """Get count of active tokens."""
    return len(_tokens)


def clear_all_tokens():
    """Clear all tokens (for testing/admin purposes)."""
    _tokens.clear()
    _user_tokens.clear()


def authenticate_request(view_func):
    """
    Decorator to authenticate API requests using token.
    Expects 'Authorization: Token <token>' header.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Token '):
            return Response(
                {'error': 'Authentication required. Provide "Authorization: Token <token>" header.'},
                status=401
            )
        
        token = auth_header.replace('Token ', '', 1).strip()
        user = get_user_from_token(token)
        
        if not user:
            return Response(
                {'error': 'Invalid or expired token.'},
                status=401
            )
        
        # Attach user to request
        request.user = user
        return view_func(request, *args, **kwargs)
    
    return wrapper


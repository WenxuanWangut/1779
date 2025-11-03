from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Ticket
from .serializers import TicketSerializer


@api_view(['GET'])
def get_tickets(request):
    """
    Get all tickets.
    """
    tickets = Ticket.objects.all()
    serializer = TicketSerializer(tickets, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


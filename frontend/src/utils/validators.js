/**
 * Validate that a value is required (not empty)
 * @param {any} value - Value to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const required = (v) => (v ? undefined : 'Required')

/**
 * Validate minimum length
 * @param {number} n - Minimum length
 * @returns {Function} Validator function
 */
export const minLen = (n) => (v) => (v && v.length >= n ? undefined : `Min length ${n}`)

/**
 * Validate maximum length
 * @param {number} n - Maximum length
 * @returns {Function} Validator function
 */
export const maxLen = (n) => (v) => (!v || v.length <= n ? undefined : `Max length ${n}`)

/**
 * Validate ticket number format
 * @param {string} v - Ticket number to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const ticketNumber = (v) => (/^\S/.test(v) ? undefined : 'Invalid ticket number')

/**
 * Validate email format
 * @param {string} v - Email to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const email = (v) => {
  if (!v) return undefined
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(v) ? undefined : 'Invalid email format'
}

/**
 * Validate password strength
 * @param {string} v - Password to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const passwordStrength = (v) => {
  if (!v) return undefined
  if (v.length < 8) return 'Password must be at least 8 characters'
  if (!/[A-Z]/.test(v)) return 'Password must contain at least one uppercase letter'
  if (!/[a-z]/.test(v)) return 'Password must contain at least one lowercase letter'
  if (!/[0-9]/.test(v)) return 'Password must contain at least one number'
  return undefined
}

/**
 * Validate that value matches another value
 * @param {any} matchValue - Value to match against
 * @param {string} fieldName - Name of the field being matched
 * @returns {Function} Validator function
 */
export const matches = (matchValue, fieldName = 'field') => (v) => {
  return v === matchValue ? undefined : `Must match ${fieldName}`
}

/**
 * Validate URL format
 * @param {string} v - URL to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const url = (v) => {
  if (!v) return undefined
  try {
    new URL(v)
    return undefined
  } catch {
    return 'Invalid URL format'
  }
}

/**
 * Validate that value is a number
 * @param {any} v - Value to validate
 * @returns {string|undefined} Error message or undefined if valid
 */
export const isNumber = (v) => {
  if (v === null || v === undefined || v === '') return undefined
  return isNaN(Number(v)) ? 'Must be a number' : undefined
}

/**
 * Validate that number is within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Function} Validator function
 */
export const numberRange = (min, max) => (v) => {
  if (!v) return undefined
  const num = Number(v)
  if (isNaN(num)) return 'Must be a number'
  if (num < min) return `Must be at least ${min}`
  if (num > max) return `Must be at most ${max}`
  return undefined
}

/**
 * Combine multiple validators
 * @param {...Function} validators - Validator functions to combine
 * @returns {Function} Combined validator function
 */
export const combineValidators = (...validators) => (value) => {
  for (const validator of validators) {
    const error = validator(value)
    if (error) return error
  }
  return undefined
}

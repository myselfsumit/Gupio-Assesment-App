/**
 * User-friendly error messages
 * Maps technical errors to user-friendly messages
 */

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection and try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please check your credentials.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again or contact support.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
};

/**
 * Gets user-friendly error message based on error type
 */
export const getUserFriendlyMessage = (error: Error | string): string => {
  const message = typeof error === 'string' ? error : error.message;
  const errorMessage = message.toLowerCase();

  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (errorMessage.includes('timeout')) {
    return ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  if (errorMessage.includes('validation') || errorMessage.includes('zod')) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }

  if (errorMessage.includes('auth') || errorMessage.includes('unauthorized')) {
    return ERROR_MESSAGES.AUTH_ERROR;
  }

  if (errorMessage.includes('server') || errorMessage.includes('500')) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  if (errorMessage.includes('not found') || errorMessage.includes('404')) {
    return ERROR_MESSAGES.NOT_FOUND;
  }

  if (errorMessage.includes('forbidden') || errorMessage.includes('403')) {
    return ERROR_MESSAGES.FORBIDDEN;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
};


/**
 * Global Error Handler Utility
 * Handles errors gracefully and provides user-friendly messages
 */

export interface ErrorInfo {
  message: string;
  code?: string;
  stack?: string;
  componentStack?: string;
  timestamp: string;
  userId?: string;
  route?: string;
}

/**
 * Formats error for console logging
 */
export const formatErrorForConsole = (error: Error, errorInfo?: any): void => {
  const timestamp = new Date().toISOString();
  
  console.group(`🚨 Error at ${timestamp}`);
  console.error('Error Message:', error.message);
  console.error('Error Stack:', error.stack);
  
  if (errorInfo) {
    console.error('Component Stack:', errorInfo.componentStack);
  }
  
  // Log error details for debugging
  console.error('Error Details:', {
    name: error.name,
    message: error.message,
    stack: error.stack?.split('\n').slice(0, 5), // First 5 lines of stack
    timestamp,
  });
  
  console.groupEnd();
};

/**
 * Formats error for user display
 */
export const formatErrorForUser = (error: Error | string): string => {
  if (typeof error === 'string') {
    return error;
  }

  const errorMessage = error.message || 'An unexpected error occurred';
  
  // Map common technical errors to user-friendly messages
  const errorMapping: Record<string, string> = {
    'Network request failed': 'Unable to connect to server. Please check your internet connection.',
    'NetworkError': 'Network error. Please try again.',
    'TypeError': 'Something went wrong. Please try again.',
    'ReferenceError': 'An application error occurred. Please restart the app.',
    'ValidationError': errorMessage, // Keep validation errors as is
    'ZodError': 'Please check your input and try again.',
  };

  // Check if error message matches any mapping
  for (const [key, value] of Object.entries(errorMapping)) {
    if (errorMessage.includes(key)) {
      return value;
    }
  }

  // Default user-friendly message
  return 'An unexpected error occurred. Please try again or contact support if the problem persists.';
};

/**
 * Logs error to console with proper formatting
 */
export const logError = (error: Error, errorInfo?: any, context?: string): void => {
  const timestamp = new Date().toISOString();
  const contextLabel = context ? `[${context}]` : '';
  
  // Color-coded console output
  console.error(
    `%c${contextLabel} Error at ${timestamp}`,
    'color: red; font-weight: bold; font-size: 14px;'
  );
  console.error('%cMessage:', 'color: #ff6b6b; font-weight: bold;', error.message);
  console.error('%cName:', 'color: #4ecdc4; font-weight: bold;', error.name);
  
  if (error.stack) {
    console.error('%cStack Trace:', 'color: #95a5a6; font-size: 11px;', error.stack);
  }
  
  if (errorInfo?.componentStack) {
    console.error('%cComponent Stack:', 'color: #95a5a6; font-size: 11px;', errorInfo.componentStack);
  }
  
  // Additional context if provided
  if (context) {
    console.error('%cContext:', 'color: #f39c12; font-weight: bold;', context);
  }
  
  // Error object for detailed inspection
  console.error('%cFull Error Object:', 'color: #9b59b6; font-weight: bold;', {
    error,
    errorInfo,
    timestamp,
    context,
  });
};

/**
 * Creates error info object
 */
export const createErrorInfo = (
  error: Error,
  errorInfo?: any,
  additionalInfo?: Record<string, any>
): ErrorInfo => {
  return {
    message: error.message,
    code: error.name,
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
    timestamp: new Date().toISOString(),
    ...additionalInfo,
  };
};

/**
 * Checks if error is a network error
 */
export const isNetworkError = (error: Error | string): boolean => {
  const message = typeof error === 'string' ? error : error.message;
  return (
    message.includes('Network') ||
    message.includes('fetch') ||
    message.includes('timeout') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ERR_INTERNET_DISCONNECTED')
  );
};

/**
 * Checks if error is a validation error
 */
export const isValidationError = (error: Error | string): boolean => {
  const message = typeof error === 'string' ? error : error.message;
  return (
    message.includes('Validation') ||
    message.includes('ZodError') ||
    message.includes('required') ||
    message.includes('invalid')
  );
};


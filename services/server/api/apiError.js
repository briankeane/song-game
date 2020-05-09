class APIError {
  static get defaults() {
    return {
      statusCode: 400,
      message: 'An unknown error occurred'
    };
  }

  constructor({ statusCode, message }) {
    this.error = new Error(message);
    this.message = message || APIError.defaults.message;
    this.statusCode = statusCode || APIError.defaults.statusCode;
  }
}

module.exports = APIError;
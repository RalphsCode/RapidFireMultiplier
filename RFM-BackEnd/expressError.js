/** Custom error class for general app errors */
class ExpressError extends Error {
    constructor(message, status) {
      super();
      this.message = message;
      this.status = status;
    }
  }
  
  /** 404 Not Found error class */
  class NotFoundError extends ExpressError {
    constructor(message = "Not Found") {
      super(message, 404);
    }
  }
  
  /** 400 Bad Request error class */
  class BadRequestError extends ExpressError {
    constructor(message = "Bad Request") {
      super(message, 400);
    }
  }
  
  /** 401 Unauthorized error class */
  class UnauthorizedError extends ExpressError {
    constructor(message = "Unauthorized") {
      super(message, 401);
    }
  }
  
  /** 403 Forbidden error class */
  class ForbiddenError extends ExpressError {
    constructor(message = "Forbidden") {
      super(message, 403);
    }
  }
  
  /** 500 Internal Server Error class */
  class InternalServerError extends ExpressError {
    constructor(message = "Internal Server Error") {
      super(message, 500);
    }
  }
  
  module.exports = {
    ExpressError,
    NotFoundError,
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    InternalServerError,
  };
  
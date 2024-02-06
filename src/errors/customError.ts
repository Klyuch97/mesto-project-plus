import { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, HTTP_STATUS_CONFLICT, HTTP_STATUS_FORBIDDEN, HTTP_STATUS_UNAUTHORIZED } from "./errors";


export class BadRequestError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_BAD_REQUEST;
  }
}

export class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}

export class ForbiddenError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

export class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = ERROR_CODE_NOT_FOUND;
  }
}

export class StatusForbidden extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_FORBIDDEN;
  }
}

export class StatusUnauthorized extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = HTTP_STATUS_UNAUTHORIZED;
  }
}
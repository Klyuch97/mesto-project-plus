import * as http2 from 'http2';

export const ERROR_CODE_BAD_REQUEST = http2.constants.HTTP_STATUS_BAD_REQUEST; // 400
export const ERROR_CODE_NOT_FOUND = http2.constants.HTTP_STATUS_NOT_FOUND; // 404
export const ERROR_CODE_SERVER_ERROR = http2.constants.HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500
export const STATUS_OK = http2.constants.HTTP_STATUS_OK; // 200
export const { HTTP_STATUS_UNAUTHORIZED } = http2.constants;// 401
export const { HTTP_STATUS_CONFLICT } = http2.constants;// 409
export const { HTTP_STATUS_FORBIDDEN } = http2.constants;// 403

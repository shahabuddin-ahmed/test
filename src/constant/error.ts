export enum ERROR_CODES {
    E_PAGE_NOT_FOUND = "E_PAGE_NOT_FOUND",
    E_UNAUTHORIZED = "E_UNAUTHORIZED",
    E_FORBIDDEN = "E_FORBIDDEN",
    E_INVALID_DATA = "E_INVALID_DATA",
    E_VALIDATION_FAILED = "E_VALIDATION_FAILED",
    E_INTERNAL_SERVER_ERROR = "E_INTERNAL_SERVER_ERROR",
    BAD_REQUEST = "BAD_REQUEST",
}

export const errorMessages: Record<ERROR_CODES, { message: string }> = {
    E_PAGE_NOT_FOUND: {
        message: "please be sane and hit correct endpoints"
    },
    E_UNAUTHORIZED: {
        message: "Invalid user/api token",
    },
    E_FORBIDDEN: {
        message: "You are not authorized to access this resource",
    },
    E_INVALID_DATA: {
        message: "Please provide valid data",
    },
    E_VALIDATION_FAILED: {
        message: "Please fill up required all fields and valid data",
    },
    E_INTERNAL_SERVER_ERROR: {
        message: "Internal Server Error",
    },
    BAD_REQUEST: {
        message: "Bad Request"
    },
};

export enum ApiResponseMessages {
    SUCCESS = "SUCCESS",
    INTERNAL_SERVER_ERROR = "Internal Server Error",
}
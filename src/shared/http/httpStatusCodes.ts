export const HttpStatusCode = Object.freeze({
        // --- 2xx Success ---
        OK: 200, // Standard success
        CREATED: 201, // Successful resource creation (e.g., POST user)
        NO_CONTENT: 204, // Success, but nothing to send back (e.g., DELETE)

        // --- 4xx Client Errors (The caller messed up) ---
        BAD_REQUEST: 400, // Validation failed / Syntax error
        UNAUTHORIZED: 401, // No valid "ID card" (missing/bad JWT)
        FORBIDDEN: 403, // Has ID card, but not allowed to see this specific data
        NOT_FOUND: 404, // The URL or ID doesn't exist
        CONFLICT: 409, // Duplicate data (e.g., email already exists in DB)
        TOO_MANY_REQUESTS: 429, // Rate limiting

        // --- 5xx Server Errors (Your code/server messed up) ---
        INTERNAL_SERVER_ERROR: 500, // Generic "Something broke"
        BAD_GATEWAY: 502, // Upstream server  is down
        SERVICE_UNAVAILABLE: 503 // Server is overloaded or down for maintenance
});

export type HttpStatusCodeType = typeof HttpStatusCode;

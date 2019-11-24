class ServerError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HTTP error';
        this.httpStatus = null;
        Error.captureStackTrace(this, this.constructor);
    }

    setStatus(httpStatus) {
        this.httpStatus = httpStatus;
        return this;
    }
}

module.exports = ServerError;
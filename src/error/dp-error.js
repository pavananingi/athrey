class CreateError extends Error {
    constructor(message, status = 400, code = 0, ...params) {
        // Pass remaining arguments (including vendor specific ones) to parent constructor
        super(...params)

        // Maintains proper stack trace for where our error was thrown (only available on V8)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CreateError)
        }

        this.name = 'CreateError'
        this.status = status;
        this.code = code;
        this.message = message;
        this.date = new Date()
    }
}

exports.CreateError = CreateError;



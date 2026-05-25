export type ErrorType = 'GENERIC' | 'VALIDATION' | 'UNAUTHORIZED' | 'NOT_FOUND';

export class ResponseError<TData = unknown> extends Error {
    protected errorType: ErrorType = 'GENERIC'
    protected data: TData | undefined

    constructor(data?: TData, message?: string) {
        super(message);
        this.data = data;
    }

    public getErrorType(): ErrorType {
        return this.errorType
    }

    public getData(): TData | undefined {
        return this.data;
    }
}

export class UnauthorizedError extends ResponseError {
    protected errorType: ErrorType = 'UNAUTHORIZED'
}


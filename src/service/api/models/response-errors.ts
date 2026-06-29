export class APIHandledError extends Error {
    constructor() {
        super('API error was already handled');
    }
}

export class UnprocessableContentError {
    errors: ValidationError[];

    constructor(errors: ValidationError[]) {
        this.errors = errors;
    }

    getByField(field: string) {
        return this.errors.filter(e => e.field === field);
    }
}

export interface ValidationError {
    field: string,
    message: string
}

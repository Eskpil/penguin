export class SchemaError extends Error {
    constructor(query: string) {
        super(`${query} does not have a matching resolver.`);
    }
}

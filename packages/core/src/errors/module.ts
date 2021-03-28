export class ModuleError extends Error {
    constructor(name: string) {
        super(`${name} is missing @Module() decorator`);
    }
}

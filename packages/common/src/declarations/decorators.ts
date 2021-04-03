export interface RouteOptions {
    method: string;
    endpoint?: string;
}

export interface ModuleOptionsInterface {
    prefix?: string;
    for?: string;
}

export type ModuleOptions = ModuleOptionsInterface | string;

export interface EventOptionsInterface {
    name: string;
}

export type EventOptions = EventOptionsInterface | string;

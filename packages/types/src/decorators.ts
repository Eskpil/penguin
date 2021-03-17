import { HttpMethods } from './request';

export interface RouteOptions {
    method: string;
    endpoint?: string;
}

export interface ModuleOptionsInterface {
    prefix: string;
}

export type ModuleOptions = ModuleOptionsInterface | string;

export interface EventOptionsInterface {
    name: string;
}

export type EventOptions = EventOptionsInterface | string;

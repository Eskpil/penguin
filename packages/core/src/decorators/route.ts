import 'reflect-metadata';
import { RouteOptions } from '@penguin/types';
import { getMetadataStorage } from '@penguin/metadata';

export function Route(options: RouteOptions): MethodDecorator {
    return (prototype, methodName) => {
        const endpoint = options.endpoint
            ? `${options.endpoint.toLowerCase()}`
            : '';

        getMetadataStorage().collectRouteMetadata({
            endpoint,
            methodName: methodName as string,
            method: options.method,
            parent: prototype.constructor.name,
        });
    };
}

export function Get(uri?: string): MethodDecorator {
    return (prototype, methodName) => {
        const endpoint = uri ? `${uri.toLowerCase()}` : '';

        getMetadataStorage().collectRouteMetadata({
            endpoint,
            methodName: methodName as string,
            method: 'get',
            parent: prototype.constructor.name,
        });
    };
}

export function Put(uri?: string): MethodDecorator {
    return (prototype, methodName) => {
        const endpoint = uri ? `${uri.toLowerCase()}` : '';

        getMetadataStorage().collectRouteMetadata({
            endpoint,
            methodName: methodName as string,
            method: 'put',
            parent: prototype.constructor.name,
        });
    };
}

export function Patch(uri?: string): MethodDecorator {
    return (prototype, methodName) => {
        const endpoint = uri ? `${uri.toLowerCase()}` : '';

        getMetadataStorage().collectRouteMetadata({
            endpoint,
            methodName: methodName as string,
            method: 'patch',
            parent: prototype.constructor.name,
        });
    };
}

export function Post(uri?: string): MethodDecorator {
    return (prototype, methodName) => {
        const endpoint = uri ? `${uri.toLowerCase()}` : '';

        getMetadataStorage().collectRouteMetadata({
            endpoint,
            methodName: methodName as string,
            method: 'post',
            parent: prototype.constructor.name,
        });
    };
}

export function Delete(uri?: string): MethodDecorator {
    return (prototype, methodName) => {
        const endpoint = uri ? `${uri.toLowerCase()}` : '';

        getMetadataStorage().collectRouteMetadata({
            endpoint,
            methodName: methodName as string,
            method: 'delete',
            parent: prototype.constructor.name,
        });
    };
}

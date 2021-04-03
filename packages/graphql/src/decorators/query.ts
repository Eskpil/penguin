import { getMetadataStorage } from '@penguin/metadata';

interface Options {
    nullable?: boolean;
    name?: string;
}

export function Query(type: Function, options?: Options): MethodDecorator {
    return (prototype, methodName) => {
        getMetadataStorage().collectQueryMetadata({
            parent: prototype.constructor.name,
            methodName: methodName as string,
            type: type().name,
            name: options
                ? options.name
                    ? options.name
                    : (methodName as string)
                : (methodName as string),
            nullable: options
                ? options.nullable
                    ? options.nullable
                    : false
                : false,
        });
    };
}

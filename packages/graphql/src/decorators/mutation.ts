import { getMetadataStorage } from '@penguin/metadata';

interface Options {
    nullable?: boolean;
    name?: string;
}

export function Mutation(type: Function, options?: Options): MethodDecorator {
    return (prototype, methodName) => {
        getMetadataStorage().collectMethodMetadata({
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
            kind: 'mutation',
        });
    };
}

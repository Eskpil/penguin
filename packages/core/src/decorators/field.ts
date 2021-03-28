import { getMetadataStorage } from '../metadata/getMetadata';

interface Options {
    name?: string;
    array?: boolean;
    nullable?: boolean;
}

export function Field(
    type?: Function | Options,
    options?: Options
): PropertyDecorator {
    return (prototype, methodName) => {
        if (type && typeof type === 'object') {
            getMetadataStorage().collectFieldMetadata({
                name: type.name ? type.name : methodName.toString(),
                parent: prototype.constructor.name,
                type: typeof methodName.toString(),
                array: type.array ? type.array : false,
                nullable: type.nullable ? type.nullable : false,
            });
        }
        if (type && typeof type === 'function') {
            if (options) {
                getMetadataStorage().collectFieldMetadata({
                    name: type.name ? type.name : methodName.toString(),
                    parent: prototype.constructor.name,
                    type: type().name,
                    array: options.array ? options.array : false,
                    nullable: options.nullable ? options.nullable : false,
                });
            } else {
                getMetadataStorage().collectFieldMetadata({
                    name: type.name ? type.name : methodName.toString(),
                    parent: prototype.constructor.name,
                    type: type().name,
                    array: false,
                    nullable: false,
                });
            }
        }
    };
}

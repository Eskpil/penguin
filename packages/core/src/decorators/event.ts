import { EventOptions } from '@penguin/types';
import { getMetadataStorage } from '@penguin/metadata';

export function Event(options: EventOptions): MethodDecorator {
    return (prototype, methodName) => {
        if (typeof options === 'object') {
            getMetadataStorage().collectEventMetadata({
                name: options.name,
                methodName: methodName as string,
                parent: prototype.constructor.name,
            });
        } else {
            getMetadataStorage().collectEventMetadata({
                name: options,
                methodName: methodName as string,
                parent: prototype.constructor.name,
            });
        }
    };
}

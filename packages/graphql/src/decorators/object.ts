import { getMetadataStorage } from '@penguin/metadata';

export function ObjectType(name?: string): ClassDecorator {
    return (target) => {
        getMetadataStorage().collectObjectMetadata({
            name: name ? name : target.name,
            target: target.name,
        });
    };
}

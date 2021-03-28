import { getMetadataStorage } from '../metadata/getMetadata';

export function InputType(name?: string): ClassDecorator {
    return (target) => {
        getMetadataStorage().collectInputMetadata({
            name: name ? name : target.name,
            target: target.name,
        });
    };
}

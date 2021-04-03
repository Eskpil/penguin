import { getMetadataStorage } from '@penguin/metadata';

interface Options {
    prefix?: string;
    imports: any[];
}

export function Package(options: Options): ClassDecorator {
    return (target) => {
        getMetadataStorage().collectPackageMetadata({
            prefix: options.prefix ? options.prefix : target.name.toLowerCase(),
            imports: options.imports,
            name: target.name.toLowerCase(),
        });
    };
}

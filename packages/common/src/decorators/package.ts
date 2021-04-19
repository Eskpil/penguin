import { getMetadataStorage } from '@penguin/metadata';

interface Options {
    prefix?: string;
    imports?: any[];
    modules: any[];
    name?: string;
}

export function Package(options: Options): ClassDecorator {
    return (target) => {
        getMetadataStorage().collectPackageMetadata({
            prefix: options.prefix ? options.prefix : target.name.toLowerCase(),
            imports: options.imports ?? options.imports,
            modules: options.modules,
            name: target.name.toLowerCase(),
        });
    };
}

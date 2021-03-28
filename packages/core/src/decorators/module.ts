import 'reflect-metadata';
import { ModuleOptions } from '@penguin/types';
import { getMetadataStorage } from '../metadata/getMetadata';

export function Module(options?: ModuleOptions): ClassDecorator {
    return (target) => {
        if (typeof options === 'object') {
            getMetadataStorage().collectModuleMetadata({
                // prefix: options.prefix ? options.prefix : target.name,
                name: target.name,
                for: options.for ? options.for : 'root',
            });
        }
        if (!options) {
            getMetadataStorage().collectModuleMetadata({
                name: target.name,
                for: 'root',
            });
        }
    };
}

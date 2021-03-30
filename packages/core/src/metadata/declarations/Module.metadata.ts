import { BaseModule } from '../../module/base';

export interface ModuleOptions {
    name: string;
    for?: string;
}

export interface BuiltModuleMetadataOptions {
    name: string;
    module: BaseModule;
    pack: {
        prefix: string;
        name: string;
        package: any;
    };
}

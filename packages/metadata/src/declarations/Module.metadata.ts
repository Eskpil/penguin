
export interface ModuleOptions {
    name: string;
    for?: string;
}

export interface BuiltModuleMetadataOptions {
    name: string;
    module: any;
    pack: {
        prefix: string;
        name: string;
        package: any;
    };
}

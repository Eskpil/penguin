import {
    BuiltModuleMetadataOptions,
    PackageMetadataOptions,
    getMetadataStorage,
} from '@penguin/metadata';

export abstract class ModuleUtils {
    static buildFromPacks(packages: any[]) {
        for (const rawpack of packages) {
            this.package(rawpack);
        }
    }

    private static module(
        rawmodule: any,
        packmetadata: PackageMetadataOptions,
        pack: any
    ) {
        const module = new rawmodule();

        const final: BuiltModuleMetadataOptions = {
            name: rawmodule.name,
            module,
            pack: {
                package: pack,
                prefix: packmetadata.prefix,
                name: packmetadata.name,
            },
        };
        getMetadataStorage().collectBuiltModuleMetadata(final);
    }

    static find(name: string) {
        return getMetadataStorage()
            .getBuiltModuleMetadata()
            .find((m) => m.name === name);
    }

    private static package(rawpack: any) {
        const packmetadata = getMetadataStorage()
            .getPackageMetadata()
            .find((p) => p.name === rawpack.name.toLowerCase());

        if (!packmetadata) {
            throw new Error(
                `Package: ${rawpack.name} is not registered in metadata.`
            );
        }

        const pack = new rawpack();

        for (const rawmodule of packmetadata.modules) {
            this.module(rawmodule, packmetadata, pack);
        }
    }
}

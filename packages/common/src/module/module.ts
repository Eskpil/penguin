import {
    BuiltModuleMetadataOptions,
    PackageMetadataOptions,
    getMetadataStorage,
} from '@penguin/metadata';

export abstract class ModuleUtils {
    static buildFromPacks(packages: any[]) {
        for (const rawpack of packages) {
            const pack = new rawpack();
            const packMetadata = getMetadataStorage()
                .getPackageMetadata()
                .find((p) => p.name === rawpack.name.toLowerCase());

            if (!packMetadata) {
                throw new Error(
                    `Package: ${rawpack.name} is not registered in metadata.`
                );
            }

            for (const rawmodule of packMetadata?.imports) {
                this.build(rawmodule, packMetadata, pack);
            }
        }
    }

    private static build(
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
}

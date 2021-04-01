import { Metadata } from './metadata';

export function getMetadataStorage(): Metadata {
    return (
        (global as any).PenguinMetadata ||
        ((global as any).PenguinMetadata = new Metadata())
    );
}

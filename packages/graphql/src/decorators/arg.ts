import { getMetadataStorage } from '@penguin/metadata';

export function Arg(name: string): ParameterDecorator {
    return (target, propertyKey, paramaterIdx) => {
        const type = Reflect.getMetadata(
            'design:paramtypes',
            target,
            propertyKey
        );

        getMetadataStorage().collectMethodParamMetadata({
            name,
            idx: paramaterIdx,
            parent: propertyKey as string,
            root: target.constructor.name,
            parentKind: 'gql',
            kind: 'arg',
            type: type[paramaterIdx].name,
        });
    };
}

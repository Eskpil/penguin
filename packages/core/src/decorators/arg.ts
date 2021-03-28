import { getMetadataStorage } from '../metadata/getMetadata';

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
            kind: 'arg',
            type: type[paramaterIdx].name,
        });
    };
}
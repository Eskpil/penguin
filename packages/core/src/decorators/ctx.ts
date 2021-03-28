import { getMetadataStorage } from '../metadata/getMetadata';

export function Ctx(): ParameterDecorator {
    return (target, propertyKey, paramaterIdx) => {
        getMetadataStorage().collectMethodParamMetadata({
            idx: paramaterIdx,
            parent: propertyKey as string,
            kind: 'context',
            root: target.constructor.name,
            parentKind: 'combined',
        });
    };
}

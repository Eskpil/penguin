import { ResolverMetadata } from '../interfaces/resolver';
import { MethodParamMetadataOptions } from '../metadata/declarations/Method.param.metadata';

export const GetParamOrder = (
    resolverData: ResolverMetadata,
    params: MethodParamMetadataOptions[]
) => {
    const paramValues = params
        .sort((a, b) => a.idx - b.idx)
        .map((paramInfo) => {
            switch (paramInfo.kind) {
                case 'arg':
                    return resolverData.args[paramInfo.name!];
                case 'context':
                    return resolverData.context;
            }
        });
    return paramValues;
};

import { MethodParamMetadataOptions } from '@penguin/metadata';

export const GetParamOrder = (
    data: any,
    params: MethodParamMetadataOptions[]
) => {
    const paramValues = params
        .sort((a, b) => a.idx - b.idx)
        .map((paramInfo) => {
            switch (paramInfo.kind) {
                case 'arg':
                    return data.args[paramInfo.name!];
                case 'context':
                    return data.context;
            }
        });
    return paramValues;
};

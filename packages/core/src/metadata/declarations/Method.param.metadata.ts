type Methods = 'context' | 'arg' | 'root' | 'info' | 'param';

export interface MethodParamMetadataOptions {
    kind: Methods;
    parent: string;
    idx: number;
    methodName?: string;
    name?: string;
    type?: string;
}

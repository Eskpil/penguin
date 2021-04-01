type Methods = 'context' | 'arg' | 'root' | 'info' | 'param';
type ParentKind = 'http' | 'gql' | 'event' | 'combined';

export interface MethodParamMetadataOptions {
    kind: Methods;
    parent: string;
    idx: number;
    parentKind: ParentKind;
    root: string;
    methodName?: string;
    name?: string;
    type?: string;
}

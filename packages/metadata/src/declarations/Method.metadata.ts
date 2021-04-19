export type Kind = 'mutation' | 'subscription' | 'query';

export interface MethodMetadataOptions {
    methodName: string;
    name: string;
    type: string;
    parent: string;
    nullable: boolean;
    kind: Kind;
}

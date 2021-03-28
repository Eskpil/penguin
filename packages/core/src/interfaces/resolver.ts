import { GraphQLResolveInfo } from 'graphql';

export interface ResolverMetadata {
    root: any;
    args: any;
    context: any;
    info: GraphQLResolveInfo;
}

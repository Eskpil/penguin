import { GraphQLFieldResolver } from 'graphql';
import { GetParamOrder } from '../helpers/resolvers.helpers';
import { ResolverMetadata } from '../interfaces/resolver';
import { QueryMetadataOptions } from '../metadata/declarations/Query.metadata';
import { getMetadataStorage } from '../metadata/getMetadata';

export abstract class Resolvers {
    static create(
        module: any,
        metadata: QueryMetadataOptions
    ): GraphQLFieldResolver<any, any, any> {
        return async (root, args, context, info) => {
            const resolverData: ResolverMetadata = {
                root,
                args,
                context,
                info,
            };

            const unsortedParams = getMetadataStorage().getGroupMethodMetadata(
                metadata.methodName
            );
            const sortedParams = GetParamOrder(resolverData, unsortedParams);

            return await module.module[metadata.methodName].apply(
                module.module,
                sortedParams
            );
        };
    }
}

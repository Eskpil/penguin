import { GraphQLFieldResolver } from 'graphql';
import { GetParamOrder } from '../helpers/params.helpers';
import { ResolverMetadata } from '../interfaces/resolver';
import { QueryMetadataOptions, getMetadataStorage } from '@penguin/metadata';

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
                metadata.methodName,
                module.name,
                'gql'
            );
            const sortedParams = GetParamOrder(resolverData, unsortedParams);

            return await module.module[metadata.methodName].apply(
                module.module,
                sortedParams
            );
        };
    }
}

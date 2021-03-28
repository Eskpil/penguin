import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLObjectType,
    GraphQLOutputType,
    GraphQLSchema,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLDirective,
    DirectiveLocationEnum,
    DirectiveLocation,
} from 'graphql';
import { dir } from 'node:console';
import { SchemaError } from '../errors/schema';
import { decorateType, ifScalar } from '../helpers/schema.helpers';
import { getMetadataStorage } from '../metadata/getMetadata';
import { BaseModule } from '../module';
import { Resolvers } from '../resolvers/create';

interface Options {
    modules: {
        prefix: string;
        name: string;
        module: BaseModule;
    }[];
}

export class SchemaGenerator {
    private modules: {
        [key: string]: {
            name: string;
            prefix: string;
            module: BaseModule;
        };
    } = {};
    private objectTypes: GraphQLObjectType[] = [];

    constructor(options: Options) {
        for (const module of options.modules) {
            this.modules[module.name] = { ...module };
        }
        this.buildObjectTypes();
    }

    build(): GraphQLSchema {
        return new GraphQLSchema({
            query: this.buildQueryTypes(),
        });
    }

    buildQueryTypes() {
        const queries = getMetadataStorage().getQueryMetadata();

        const fields: {
            [key: string]: any;
        } = {};

        for (const query of queries) {
            const type = this.getGraphqlOutputType(query);
            const module = this.modules[query.parent];

            const args: {
                [key: string]: any;
            } = {};

            const methodParams = getMetadataStorage().getGroupMethodMetadata(
                query.methodName
            );

            for (const arg of methodParams.filter((m) => m.kind === 'arg')) {
                const argType = this.getGraphqlOutputType(arg);
                args[arg.name!] = {
                    type: argType,
                };
            }

            fields[query.name] = {
                type,
                args,
                resolve: Resolvers.create(module, query),
            };
        }

        return new GraphQLObjectType({
            name: 'Query',
            fields,
        });
    }

    buildObjectTypes() {
        for (const objectMetadata of getMetadataStorage().getObjectMetadata()) {
            const objectType = this.buildObjectType(objectMetadata.name);

            this.objectTypes.push(objectType);
        }
    }

    buildObjectType(name: string) {
        const objectTypeMetadata = getMetadataStorage()
            .getObjectMetadata()
            .find((o) => o.name === name);

        if (!objectTypeMetadata) {
            throw new Error(`Object: ${name} is not registered in metadata.`);
        }

        const fieldsMetadata = getMetadataStorage().getGroupFieldMetadata(
            objectTypeMetadata.name
        );

        if (!fieldsMetadata) {
            throw new Error(
                `Object: ${name} has no fields registered in metadata.`
            );
        }

        const fields: {
            [key: string]: any;
        } = {};

        for (const fieldMetadata of fieldsMetadata) {
            let type = this.getGraphqlOutputType(fieldMetadata);
            if (!type) {
                this.buildObjectType(fieldMetadata.type);
                type = this.getGraphqlOutputType(fieldMetadata);
            }

            if (!type) {
                throw new Error(
                    `Type: ${fieldMetadata.type} is not registered in metadata.`
                );
            }

            fields[fieldMetadata.name] = {
                type,
            };
        }

        return new GraphQLObjectType({
            name: objectTypeMetadata.name,
            fields,
        });
    }

    getGraphqlOutputType(field: any) {
        let type: any;
        type = ifScalar(field.type);

        if (!type) {
            const objectType = this.objectTypes.find(
                (o) => o.name === field.type
            );
            if (objectType) {
                type = objectType;
            }
        }

        if (type) {
            const newType = decorateType(type, {
                nullable: field.nullable,
                array: field.array,
            });
            if (newType) type = newType;
        }

        return type;
    }
}

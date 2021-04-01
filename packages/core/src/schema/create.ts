import {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInputObjectType,
} from 'graphql';
import { decorateType, ifScalar } from '../helpers/schema.helpers';
import { getMetadataStorage} from "@penguin/metadata"
import { Resolvers } from '../resolvers/create';
import { Module } from '../module/module';

export class SchemaGenerator {
    private objectTypes: GraphQLObjectType[] = [];
    private inputTypes: GraphQLInputObjectType[] = [];

    constructor() {
        this.buildObjectTypes();
        this.buildInputTypes();
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
            const module = Module.find(query.parent)

            if (!module) {
                throw new Error(
                    `Query: ${query.name} does not have a parent registered in metadata.`
                );
            }

            const args: {
                [key: string]: any;
            } = {};

            const methodParams = getMetadataStorage().getGroupMethodMetadata(
                query.methodName,
                module.name,
                'gql'
            );

            for (const arg of methodParams.filter((m) => m.kind === 'arg')) {
                const argType = this.getGraphqlInputType(arg);
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

    buildInputTypes() {
        for (const inputMetadata of getMetadataStorage().getInputMetadata()) {
            const inputType = this.buildInputType(inputMetadata.target);
            if (!inputType) {
                console.log('no inputtype');
            }
            this.inputTypes.push(inputType!);
        }
    }

    buildInputType(name: string) {
        const inputMetadata = getMetadataStorage()
            .getInputMetadata()
            .find((i) => i.name === name);

        if (name === 'String') {
            return null;
        }

        if (!inputMetadata) {
            throw new Error(`Input: ${name} is not registered in metadata.`);
        }

        const fields: {
            [key: string]: any;
        } = {};

        const fieldsMetadata = getMetadataStorage().getGroupFieldMetadata(
            inputMetadata.name
        );

        for (const fieldMetadata of fieldsMetadata) {
            let type = this.getGraphqlInputType(fieldsMetadata);
            if (!type) {
                this.buildInputType(fieldMetadata.type);
                type = this.getGraphqlInputType(fieldMetadata);
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
        return new GraphQLInputObjectType({
            name: inputMetadata.name,
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

    getGraphqlInputType(field: any) {
        let type: any;
        type = ifScalar(field.type);

        if (!type) {
            const inputType = this.inputTypes.find(
                (i) => i.name === field.type
            );
            if (inputType) {
                type = inputType;
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

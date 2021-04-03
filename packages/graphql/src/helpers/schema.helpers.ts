import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLList,
    GraphQLNonNull,
    GraphQLScalarType,
    GraphQLString,
} from 'graphql';

export const ifScalar = (type: string): GraphQLScalarType | undefined => {
    switch (type) {
        case 'String':
            return GraphQLString;
        case 'Number':
            return GraphQLFloat;
        case 'Boolean':
            return GraphQLBoolean;
        default:
            return undefined;
    }
};

export const decorateType = (
    typeFromInput: GraphQLScalarType,
    options: {
        nullable: boolean;
        array: boolean;
    }
): GraphQLScalarType | undefined => {
    let type: any;
    if (!options.nullable) {
        type = new GraphQLNonNull(typeFromInput);
    }
    if (options.array) {
        type = new GraphQLList(type ? type : typeFromInput);
    }
    return type;
};

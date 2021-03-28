import {
    buildSchema,
    getIntrospectionQuery,
    graphqlSync,
    parse,
} from 'graphql';
import path from 'path';
import fs from 'fs';

export const ReadSchema = () => {
    const rawschema = fs.readFileSync(
        path.join(process.cwd(), 'src', 'schema.gql'),
        'utf8'
    );
    const schema = buildSchema(rawschema);

    return graphqlSync(schema, getIntrospectionQuery()).data as any;
};

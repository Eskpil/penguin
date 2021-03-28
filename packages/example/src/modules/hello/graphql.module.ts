import { Module, Query } from '@penguin/core';

@Module()
export class GraphQLTestModule {
    @Query(() => String)
    async hello() {
        return 'Holà, Mundo!';
    }
}

import { Module } from '@penguin/common';
import { Query } from '@penguin/graphql';

@Module()
export class HelloGraphQlModule {
    @Query(() => String)
    hello() {
        return 'Holà Mundo!';
    }
}

import { Module, Query } from '@penguin/core';

@Module()
export class HelloGraphQlModule {
    @Query(() => String)
    hello() {
        return 'Holà Mundo!';
    }
}

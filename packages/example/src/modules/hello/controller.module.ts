import { Get, Module } from '@penguin/core';

@Module()
export class HelloControllerModule {
    @Get()
    hello() {
        return {
            message: 'Holà Mundo!',
        };
    }
}

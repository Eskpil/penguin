import { Get, Module } from '@penguin/core';

@Module()
export class ControllerTestModule {
    @Get()
    hello() {
        return {
            Holà: 'Mundo!',
        };
    }
}

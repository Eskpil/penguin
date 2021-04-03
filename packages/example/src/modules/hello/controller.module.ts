import { Get, Module } from '@penguin/common';

@Module()
export class HelloControllerModule {
    @Get()
    hello() {
        return {
            message: 'Holà Mundo!',
        };
    }
}

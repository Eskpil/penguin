import { Package } from '@penguin/common';
import { HelloControllerModule } from './controller.module';
import { HelloGraphQlModule } from './graphql.module';

@Package({
    modules: [HelloControllerModule, HelloGraphQlModule],
})
export class Hello {}

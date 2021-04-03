import { Package } from '@penguin/common';
import { HelloControllerModule } from './controller.module';
import { HelloGraphQlModule } from './graphql.module';

@Package({
    imports: [HelloControllerModule, HelloGraphQlModule],
})
export class Hello {}

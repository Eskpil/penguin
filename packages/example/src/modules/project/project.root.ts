import { Package } from '@penguin/common';
import { ProjectControllerModule } from './controller.module';
import { ProjectGraphqlModule } from './graphql.module';

@Package({
    imports: [ProjectControllerModule, ProjectGraphqlModule],
})
export class Project {}

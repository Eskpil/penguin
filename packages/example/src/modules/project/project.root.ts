import { Package } from '@penguin/common';
import { ProjectControllerModule } from './controller.module';
import { ProjectGraphqlModule } from './graphql.module';

@Package({
    modules: [ProjectControllerModule, ProjectGraphqlModule],
})
export class Project {}

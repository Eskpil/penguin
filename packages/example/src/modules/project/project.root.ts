import { Package } from '@penguin/core';
import { ProjectControllerModule } from './controller.module';
import { ProjectGraphqlModule } from './graphql.module';

@Package({
    imports: [ProjectControllerModule, ProjectGraphqlModule],
    
})
export class Project {
  
}

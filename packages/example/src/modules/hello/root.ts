import { Package } from '@penguin/core';
import { ControllerTestModule } from './controller.module';
import { GraphQLTestModule } from './graphql.module';

@Package({ imports: [GraphQLTestModule, ControllerTestModule] })
export class Hello {}

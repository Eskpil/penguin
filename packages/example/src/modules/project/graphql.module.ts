import { Arg, Field, Module, ObjectType, Query } from '@penguin/core';
import { projects } from './project.shared';

@ObjectType()
export class ProjectResponse {
    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String)
    repo: string;

    @Field(() => String, { nullable: false, array: true })
    contributers: string[];
}

@Module({ for: 'ProjectResponse' })
export class ProjectGraphqlModule {
    @Query(() => ProjectResponse, { nullable: true })
    async project(@Arg('name') name: string) {
        const project = projects.find((p) => p.name === name);

        if (!project) {
            return null;
        }

        return project;
    }
}

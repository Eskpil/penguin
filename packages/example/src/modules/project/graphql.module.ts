import { Module } from '@penguin/common';
import {
    Arg,
    Field,
    InputType,
    Mutation,
    ObjectType,
    Query,
} from '@penguin/graphql';
import { projects } from './project.shared';

@ObjectType()
export class Project {
    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String)
    repo: string;

    @Field(() => String, { nullable: false, array: true })
    contributers: string[];
}

@InputType()
export class ProjectInput {
    @Field(() => String, { nullable: false })
    name: string;

    @Field(() => String)
    repo: string;

    @Field(() => String, { nullable: false, array: true })
    contributers: string[];
}

@Module({ for: 'ProjectResponse' })
export class ProjectGraphqlModule {
    @Query(() => Project, { nullable: true })
    async project(@Arg('name') name: string) {
        const project = projects.find((p) => p.name === name);

        if (!project) {
            return null;
        }

        return project;
    }

    @Mutation(() => Project, { nullable: true })
    async create(@Arg('options') options: ProjectInput) {
        const project = {
            ...options,
        };
        projects.push(project);
        return project;
    }
}

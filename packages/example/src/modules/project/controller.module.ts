import { Ctx, Get, Module, Post } from '@penguin/core';
import { MyContext } from '../../types';
import { projects } from './project.shared';

@Module()
export class ProjectControllerModule {
    @Get(':name')
    project(@Ctx() ctx: MyContext) {
        const project = projects.find((p) => p.name === ctx.req.params.name);
        return project;
    }

    @Post()
    createProject(@Ctx() ctx: MyContext) {
        const { name, repo, contributers } = ctx.req.body;
        const project = {
            name,
            repo,
            contributers,
        };
        projects.push(project);
        return project;
    }
}

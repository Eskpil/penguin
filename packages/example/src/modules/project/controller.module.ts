import { Ctx, Get, Module } from '@penguin/core';
import { MyContext } from '../../types';
import { projects } from './project.shared';

@Module()
export class ProjectControllerModule {
    @Get(':name')
    project(@Ctx() ctx: MyContext) {
        const project = projects.find((p) => p.name === ctx.req.params.name);
        return project;
    }
}

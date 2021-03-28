import { Module } from './decorators/module';
import { Get, Post } from './decorators/route';
import { Event } from './decorators/event';
import { BaseModule } from './module';
import { Query } from './decorators/query';
import { ObjectType } from './decorators/object';
import { Field } from './decorators/field';
import { Arg } from './decorators/arg';
import { Ctx } from './decorators/ctx';

@ObjectType()
export class Project {
    @Field(() => String, { array: true, nullable: false })
    roles: string[];

    @Field(() => String, { array: true })
    contributed: string[];

    @Field(() => String)
    wants: string;
}

@ObjectType()
export class MyObject {
    @Field(() => String, { name: 'hello', nullable: false, array: false })
    name: string[];

    @Field(() => Number, { nullable: true })
    age: number;

    @Field(() => Project, { nullable: true })
    project: Project;
}

@Module({ for: 'MyObject' })
export class GraphqlController extends BaseModule {
    @Query(() => MyObject)
    hello(
        @Arg('name') name: string,
        @Arg('wants') wants: string,
        @Ctx() ctx: any
    ) {
        return {
            name,
            project: {
                roles: ['Contributer', 'Author', 'Maintainer'],
                contributed: ['Docs', 'Core'],
                wants,
            },
        };
    }
}

@Module({
    prefix: 'test',
})
export class Controller extends BaseModule {
    @Get()
    async get(ctx: any) {
        ctx.res.json({ get: 'success' });
    }

    @Post()
    async hello(ctx: any) {
        const body = ctx.req.body;
        ctx.res.json(body);
    }

    @Get('jesus')
    async jesus(ctx: any) {
        ctx.res.json({ jesus: 'christ' });
    }

    @Get(':id')
    async levi(ctx: any) {
        ctx.res.json({ levi: 'levi er sexy', params: { ...ctx.req.params } });
    }

    @Event({ name: 'uwu' })
    async coco(ctx: any) {
        return { uwu: 'uwu', status: 'pirate' };
    }

    @Event({ name: 'owo' })
    async banana(ctx: any) {
        return { event: 'owo' };
    }
}

@Module({
    prefix: 'test2',
})
export class Controller2 extends BaseModule {
    @Post()
    async hello(ctx: any) {
        const body = ctx.req.body;
        ctx.res.json(body);
    }
}

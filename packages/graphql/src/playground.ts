import { Request, Response } from '@penguin/common';
import {
    renderPlaygroundPage,
    RenderPageOptions as PlaygroundRenderPageOptions,
} from '@apollographql/graphql-playground-html';

export const render = (res: Response, req: Request) => {
    const playgroundRenderPageOptions: PlaygroundRenderPageOptions = {
        endpoint: req.url,
        subscriptionEndpoint: '/penguin',
    };
    const playground = renderPlaygroundPage(playgroundRenderPageOptions);
    res.status(200).send(playground).execute();
};

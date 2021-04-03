import { Request, Response } from '@penguin/common';

export type MyContext = {
    req: Request;
    res: Response;
};

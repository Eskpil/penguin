import { Request, Response } from "@penguin/core";

export type MyContext = {
    req: Request,
    res: Response
}
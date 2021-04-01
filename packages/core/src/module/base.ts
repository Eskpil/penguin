import { generateSnowflake } from '../utils/snowflake';

interface Options {
    orm: any;
}

export class BaseModule {
    id: number;

    constructor() {
        this.id = generateSnowflake();
    }

    async init(options: Options) {}
}

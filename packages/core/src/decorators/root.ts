interface Options {
    prefix: string;
    modules: any[];
}

export function Root(options: Options): ClassDecorator {
    return (target) => {
        console.log(target);
    };
}

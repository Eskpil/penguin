import { getMetadataStorage } from '@penguin/metadata';

export abstract class RequestUtils {
    static modules = getMetadataStorage().getBuiltModuleMetadata();
    static prefix: string;

    static routes: {
        [key: string]: {
            methodName: string;
            parent: string;
            reg: RegExp;
            path: string;
            param: string[];
        }[];
    } = {};

    static pathJoin(list: string[]): string {
        let u = list
            .map((a) => a.replace(/[^-_\.\w:\/]+/g, ''))
            .filter((a) => a && a !== '/')
            .join('/');
        if (u[u.length - 1] === '/') {
            u = u.substr(0, u.length - 1);
        }
        if (u[0] !== '/') {
            u = '/' + u;
        }
        return u;
    }
    static pathToReg(...list: string[]): RegExp {
        const u = this.pathJoin(list);
        return new RegExp(
            `^${u
                .replace(/:\w+/g, '([-_%\\.\\w]+)')
                .replace(/[\/\.]/g, '\\$&')}\\/?$`
        );
    }

    static build() {
        for (const module of RequestUtils.modules) {
            const routes = getMetadataStorage().getGroupRouteMetadata(
                module.name
            );
            if (!routes) return;
            for (const route of routes) {
                RequestUtils.routes[route.method].push({
                    methodName: route.methodName,
                    reg: RequestUtils.pathToReg(
                        RequestUtils.prefix,
                        module.pack.prefix,
                        route.endpoint
                    ),
                    path: RequestUtils.pathJoin([
                        RequestUtils.prefix,
                        module.pack.prefix,
                        route.endpoint,
                    ]).replace(/:(\w+)/g, '{$1}'),
                    param: (route.endpoint.match(/:\w+/g) || []).map((a) =>
                        a.substr(1)
                    ),
                    parent: module.name,
                });
            }
        }
    }

    static find(
        req: any
    ): {
        m: string[] | null;
        map: {
            methodName: string;
            parent: string;
            reg: RegExp;
            path: string;
            param: string[];
        } | null;
    } {
        const method = req.method.toLowerCase();
        for (const i in this.routes[method]) {
            const m = req.url.match(this.routes[method][i].reg);
            if (m) {
                const matches = [];
                for (let i = 0; i < m.length; i++) {
                    matches[i] = decodeURIComponent(m[i]);
                }
                return { m: matches, map: this.routes[method][i] };
            }
        }
        return { m: null, map: null };
    }
}

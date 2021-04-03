export class Util {
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
}

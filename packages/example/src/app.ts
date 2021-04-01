import { Mount } from '@penguin/core';
import { Hello, Project } from './modules';

(async () => {
    new Mount({
        app: {
            context: ({ req, res, ws }) => ({ req, res, ws }),
            prefix: 'api',
            packages: [Hello, Project],
        },
        orm: false,
    }).listen(4000, () => console.log(`Penguin server started on port 4000`))
})();

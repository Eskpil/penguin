import { Mount } from '@penguin/core';
import { Hello, Project } from './modules';

(async () => {
    new Mount({
        app: {
            context: ({ req, res, socket }) => ({ req, res, socket }),
            prefix: 'api',
            packages: [Hello, Project],
        },
    }).listen(4000, () => console.log(`Penguin server started on port 4000`));
})();

import { Mount } from '@penguin/core';
import { Hello } from './modules/hello/root';

(async () => {
    const app = new Mount({
        app: {
            context: ({ req, res, ws }) => ({ req, res, ws }),
            prefix: 'api',
            packages: [Hello],
        },
        orm: false,
    });

    app.listen(4000, () => console.log(`Penguin server started on port 4000`));
})();

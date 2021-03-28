import { Mount } from './mount';
import { Controller, Controller2, GraphqlController } from './tests';

const PORT = 3000;

const app = new Mount({
    app: {
        context: ({ ws, req, res }) => ({ ws, req, res }),
        modules: [Controller, Controller2, GraphqlController],
        prefix: 'api',
    },
    orm: false,
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

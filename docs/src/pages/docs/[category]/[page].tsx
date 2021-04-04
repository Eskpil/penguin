import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { Container, container } from '../../../container';
import { useRouter } from 'next/router';
import { Redirect } from 'next/';

interface Props {
    final: {
        params: {
            page: string;
            category: string;
        };
        meta: string;
    };
}

const DocumentationPage: React.FC<Props> = (props) => {
    const router = useRouter();

    const [component, setComponent] = useState<Container>();
    const [loading, setLoading] = useState<boolean>(false);

    const find = () => {
        setLoading(true);
        const cont = container.find(
            (c) =>
                c.params.name.toLowerCase() === router.query.page &&
                c.params.category.toLowerCase() === router.query.category
        );
        setLoading(false);
        setComponent(cont);
        return cont;
    };

    useEffect(() => {
        find();
    }, [router]);

    if (loading) {
        return <div>Loading</div>;
    }

    if (!component) {
        return <div>Hello</div>;
    }

    if (!loading && component) {
        return (
            <Layout
                container={{
                    params: {
                        name: component.params.name,
                        category: component.params.category,
                    },
                    meta: component.meta,
                }}
            >
                <component.component />
            </Layout>
        );
    }

    return <div>Hello</div>;
};

// export const getStaticPaths = (context: any) => {
//     return {
//         paths: [
//             ...container.map((c) => ({
//                 params: {
//                     category: c.params.category,
//                     page: c.params.name,
//                 },
//             })),
//         ],
//         fallback: true,
//     };
// };

// // export const getStaticProps = (context: any) => {
// //     const page = context.params.page.toString().toLowerCase();
//     const category = context.params.category.toString().toLowerCase();

//     const component = container.find(
//         (c) =>
//             c.params.name.toLowerCase() === page &&
//             c.params.category.toLowerCase() === category
//     );

//     if (!component) {
//         return {
//             redirect: {
//                 destination: '/',
//                 permanent: false,
//             },
//         };
//     }

//     const final = {
//         meta: component.meta,
//         params: {
//             page,
//             category,
//         },
//     };

//     return {
//         props: {
//             final,
//         },
//     };
// };

export default DocumentationPage;

import React, { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import { Container, container } from '../../../container';
import { useRouter } from 'next/router';

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

    return <div>My name is jeff.</div>;
};

export default DocumentationPage;

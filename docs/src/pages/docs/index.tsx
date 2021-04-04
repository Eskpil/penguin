import React from 'react';
import Layout from '../../components/Layout';

const Index = () => {
    return (
        <Layout
            container={{
                params: {
                    name: 'Docs',
                    category: 'general',
                },
                meta: 'Documentation page for penguin.',
            }}
        >
            <div className="text-white">Documentation page</div>
        </Layout>
    );
};

export default Index;

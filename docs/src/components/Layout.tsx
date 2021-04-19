import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { DocumentationTree } from './DocumentationTree';

interface Props {
    container?: {
        params: {
            name: string;
            category: string;
        };
        meta: string;
    };
}

const Layout: React.FC<Props> = ({ children, container }) => {
    if (container) {
        return (
            <>
                <Head>
                    <title>{container.params.name} | Penguin</title>
                    <meta name="og:description" content={container.meta} />
                    <link
                        rel="icon"
                        href="https://media.discordapp.net/attachments/828046390214524958/828046590152540160/penguin-pink.png"
                        type="icon"
                    />
                </Head>
                <div className="bg-gray-900 h-screen">
                    <Navbar />
                    <div className="container lg mt-16 ml-24 grid sm:grid-cols-1 md:grid-cols-3 grid-flow-col">
                        <div className="col-span-1 row-span-6">
                            <DocumentationTree />
                        </div>
                        <div className="col-span-2 row-span-6 bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                            {children}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Penguin</title>
                <link
                    rel="icon"
                    href="https://media.discordapp.net/attachments/828046390214524958/828046590152540160/penguin-pink.png"
                    type="icon"
                />
            </Head>
            <div className="bg-gray-900 h-screen">
                <Navbar />
                {children}
            </div>
        </>
    );
};

export default Layout;

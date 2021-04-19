import React, { useEffect, useState } from 'react';
import { container } from '../container';
import Link from 'next/link';

export const DocumentationTree: React.FC = ({}) => {
    const [common, setCommon] = useState<
        {
            name: string;
        }[]
    >([]);
    const [core, setCore] = useState<{ name: string }[]>([]);
    const [graphql, setGraphql] = useState<{ name: string }[]>([]);

    useEffect(() => {
        setCommon(
            container
                .filter((c) => c.params.category === 'common')
                .map((c) => ({ name: c.params.name }))
        );
        setCore(
            container
                .filter((c) => c.params.category === 'core')
                .map((c) => ({ name: c.params.name }))
        );
        setGraphql(
            container
                .filter((c) => c.params.category === 'graphql')
                .map((c) => ({ name: c.params.name }))
        );
    }, [container]);

    return (
        <div className="flex bg-gray-800 h-full w-60 flex-col p-8 rounded-2xl shadow-xl">
            <div>
                <h1 className="font-bold text-white">Common</h1>
                <ul>
                    {common.map(({ name }) => (
                        <li>
                            <Link href={`/docs/common/${name.toLowerCase()}`}>
                                <p className="text-white hover:underline cursor-pointer">
                                    - {name}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h1 className="font-bold text-white">Core</h1>
                <ul>
                    {core.map(({ name }) => (
                        <li>
                            <Link href={`/docs/core/${name.toLowerCase()}`}>
                                <p className="text-white hover:underline cursor-pointer">
                                    <span>-</span> {name}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h1 className="font-bold text-white">Graphql</h1>
                <ul>
                    {graphql.map(({ name }) => (
                        <li>
                            <Link href={`/docs/graphql/${name.toLowerCase()}`}>
                                <p className="text-white hover:underline cursor-pointer">
                                    {name}
                                </p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC<{}> = () => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <div
                className={`w-full h-12 flex justify-around items-center p-8 ${
                    !open ? 'shadow-2xl' : 'shadow-md'
                }`}
            >
                <Link href="/">
                    <h1 className="font-bold text-2xl tracking-wide text-white hover:underline cursor-pointer">
                        Penguin
                    </h1>
                </Link>
                <ul className="hidden space-x-12 md:flex">
                    <li>
                        <Link href="/docs">
                            <div className="flex items-center justify-between">
                                <svg
                                    className="h-8 w-8 text-white mt-2"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    {' '}
                                    <path
                                        stroke="none"
                                        d="M0 0h24v24H0z"
                                    />{' '}
                                    <path d="M16 6h3a1 1 0 0 1 1 1v11a2 2 0 0 1 -4 0v-13a1 1 0 0 0 -1 -1h-10a1 1 0 0 0 -1 1v12a3 3 0 0 0 3 3h11" />{' '}
                                    <line x1="8" y1="8" x2="12" y2="8" />{' '}
                                    <line x1="8" y1="12" x2="12" y2="12" />{' '}
                                    <line x1="8" y1="16" x2="12" y2="16" />
                                </svg>
                                <p className="text-white hover:underline cursor-pointer">
                                    Documentation
                                </p>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <a
                            href="https://github.com/Eskpil/penguin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline"
                        >
                            <div className="flex items-center justify-between bg-pink-700 px-2 rounded-full">
                                <svg
                                    className="h-8 w-8 text-white mt-2"
                                    viewBox="0 0 32 32"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                                </svg>
                                Github
                            </div>
                        </a>
                    </li>
                </ul>
                <div className="flex md:hidden relative z-10">
                    <span onClick={() => setOpen(!open)}>
                        <svg
                            className="h-8 w-8 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </span>
                </div>
            </div>
            <div className={`${open ? 'block' : 'hidden'} w-full shadow-2xl`}>
                <ul className="p-4 flex flex-col justify-center items-center">
                    <li>
                        <a
                            href="https://github.com/Eskpil/penguin"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white hover:underline"
                        >
                            Github
                        </a>
                    </li>
                    <li>
                        <Link href="/docs">
                            <p className="text-white hover:underline cursor-pointer">
                                Documentation
                            </p>
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Navbar;

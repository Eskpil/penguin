import React from 'react';

interface Props {
    click: () => void;
}

export const Button: React.FC<Props> = ({ click, children }) => {
    return (
        <button
            className="bg-pink-700 flex items-center justify-center rounded-xl font-sans font-bold text-white p-2 transition-colors  hover:bg-pink-600 "
            onClick={() => click()}
        >
            {children}
        </button>
    );
};

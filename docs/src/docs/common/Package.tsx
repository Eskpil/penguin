import React from 'react';
import { PrismLight } from 'react-syntax-highlighter';
import { CopyBlock, dracula } from 'react-code-blocks';

export const Package: React.FC = () => {
    const codeblocks = {
        decoratorExample: `@Package({
        imports: [GraphQLHelloModule],
        prefix: 'hello',                
        name: 'Hello'
    })`,
    };

    return (
        <div className="p-8">
            <div className="text-white">
                <text>
                    Unlike <strong>NestJS </strong>we package together modules
                    and not controllers etc in the module. To register a package
                    our modules we create a class and decorate it with the
                    <strong> @Package() </strong>
                    decorator like so.
                </text>
                <CopyBlock
                    text={codeblocks['decoratorExample']}
                    language="typescript"
                    theme={dracula}
                />
                <text></text>
            </div>
        </div>
    );
};

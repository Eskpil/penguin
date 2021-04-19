import React from 'react';
import { CopyBlock, dracula } from 'react-code-blocks';
import { Button } from '../../components/Button';

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
                    and not controllers in the module. To register a package
                    with our modules we create a class and decorate it with the
                    <strong className="text-green-300"> @Package() </strong>
                    decorator like so.
                </text>
                <div className="mt-8">
                    <CopyBlock
                        text={codeblocks['decoratorExample']}
                        language="typescript"
                        theme={dracula}
                    />
                </div>

                <div className="mt-8">
                    <text>
                        The
                        <code className="text-green-300"> imports: [] </code>
                        property is where we import our modules, we do not
                        create a new instance of this class, penguin handles
                        this for us. If you have not inserted any Modules
                        penguin will throw you a error.
                    </text>
                </div>
                <div className="mt-8">
                    <text>
                        The
                        <code className="text-green-300"> prefix: "" </code>
                        property is where we would add a url prefix that comes
                        after the global prefix specified in the Mount. This
                        defaults to a lowercased version of your classname.
                    </text>
                </div>
                <div className="mt-8">
                    <text>
                        The
                        <code className="text-green-300"> name: "" </code>
                        property serves close to no purpose but is here if you
                        dont want the Package name to be a lowercased version of
                        you classname.
                    </text>
                </div>
            </div>
        </div>
    );
};

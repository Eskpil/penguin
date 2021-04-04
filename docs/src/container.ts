import React from 'react';
import { Package } from './docs/common/Package';
import { Mount } from './docs/core/Mount';
type Category = 'core' | 'common' | 'graphql';

export interface Container {
    params: {
        name: string;
        category: Category;
    };
    meta: string;
    component: React.FC;
}

export const container: Container[] = [
    {
        params: {
            name: 'Mount',
            category: 'core',
        },
        meta: 'Documentation for the Mount class.',
        component: Mount,
    },
    {
        params: {
            name: 'Package',
            category: 'common',
        },
        meta: 'Documentation for the Package decorator.',
        component: Package,
    },
];

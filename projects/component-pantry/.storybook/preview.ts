import type { Preview } from '@storybook/angular';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
setCompodocJson(docJson);

const preview: Preview = {
    parameters: {
        backgrounds: {
            default: 'lightgray',
            values: [
                {
                    name: 'lightgray',
                    value: '#f0f0f0',
                },
                {
                    name: 'twitter',
                    value: '#00aced',
                },
                {
                    name: 'facebook',
                    value: '#3b5998',
                },
                {
                    name: 'light',
                    value: '#ffffff',
                },
                {
                    name: 'dark',
                    value: '#646c80',
                },
            ],
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
};

export default preview;

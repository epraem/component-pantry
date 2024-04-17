import type { Meta, StoryObj } from '@storybook/angular';
import { BUTTON_SIZES, BUTTON_TYPES, ButtonComponent } from '../lib/components/button'; // Adjusted import path

const meta: Meta<ButtonComponent> = {
    title: 'Components/Button',
    component: ButtonComponent,
    tags: ['autodocs'],
    argTypes: {
        backgroundColor: {
            control: 'color',
            description:
                'Used to force set the background color. Note that this does not influence hover and active states unless explicitly configured.',
        },
        disabled: {
            control: 'boolean',
            description: 'Disabled state. Accepts true or false value.',
            table: {
                defaultValue: {
                    summary: false,
                },
            },
        },
        iconLeft: {
            control: 'text',
            description: 'The icon to display on the left side of the label. Expected to be a valid icon reference.',
        },
        iconRight: {
            control: 'text',
            description: 'The icon to display on the right side of the label. Expected to be a valid icon reference.',
        },
        label: {
            control: 'text',
            description:
                'The text to display on the button. This label can be anything from a simple string to complex HTML.',
            table: {
                defaultValue: {
                    summary: 'Click Me',
                },
            },
        },
        size: {
            control: 'select',
            description: `Defines the size of the button. Accepted values are 'xsm', 'sm', 'lg', or 'normal'.`,
            options: BUTTON_SIZES,
            table: {
                defaultValue: { summary: 'normal' },
            },
        },
        textColor: {
            control: 'color',
            description:
                'Used to force set the background color. Note: This does not influence hover and active states unless explicitly configured.',
        },
        type: {
            control: 'select',
            description: `Defines the type of the button, which influences its styling. Valid types are 'primary' and 'secondary'.`,
            options: BUTTON_TYPES,
            table: {
                defaultValue: { summary: 'primary' },
            },
        },
    },
    args: {},
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {
    args: {
        type: 'primary',
    },
};

export const Disabled: Story = {
    args: {
        label: 'Not Allowed',
        disabled: true,
    },
};

export const Success: Story = {
    args: {
        textColor: '#fff',
        label: 'Purchase',
        type: 'success',
    },
};

export const Danger: Story = {
    args: {
        label: 'Delete',
        type: 'danger',
    },
};

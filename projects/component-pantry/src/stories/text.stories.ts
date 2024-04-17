import type { Meta, StoryObj } from '@storybook/angular';
import { TextComponent } from '../lib/components/text';
import { FONT_WEIGHTS, TEXT_TYPES } from '../lib/components/text';

const meta: Meta<TextComponent> = {
    title: 'Components/Text',
    component: TextComponent,
    tags: ['autodocs'],
    argTypes: {
        fontSize: {
            control: 'number',
            description: `Specifies the font size of the text, overwrites the text type's font size (px). Accepts any valid CSS font-size value.`,
        },
        fontWeight: {
            control: 'select',
            description: `Specifies the font weight of the text, overwrites the text type's font weight.`,
            options: FONT_WEIGHTS,
            table: {
                defaultValue: {
                    summary: 'normal',
                },
            },
        },
        textColor: {
            control: 'color',
            description: 'Specifies the text color. Accepts any valid CSS color format.',
        },
        textContent: {
            control: 'text',
            description: 'The text content to be displayed. This is the actual text that appears in the component.',
            table: {
                defaultValue: {
                    summary: 'This is a text',
                },
            },
        },
        textType: {
            control: 'select',
            description: 'Specifies the type of text with pre-set font-size and font-weight.',
            options: TEXT_TYPES,
            table: {
                defaultValue: {
                    summary: 'paragraph',
                },
            },
        },
    },
    args: {},
};

export default meta;
type Story = StoryObj<TextComponent>;

export const Paragraph: Story = {
    args: {
        textContent: 'Eww such plain, much bored',
        textType: 'paragraph',
    },
};

export const Larger: Story = {
    args: {
        textContent: 'Dis large, such heavy',
        textType: 'larger',
    },
};

export const BoldColored: Story = {
    args: {
        textContent: 'Wow such color, much thick!',
        textType: 'large',
        textColor: '#098a5a',
        fontWeight: 'bold',
    },
};

export const CustomFontSize: Story = {
    args: {
        textContent: 'Such amaze, many font size!',
        fontSize: 50,
        textColor: '#342abd',
    },
};

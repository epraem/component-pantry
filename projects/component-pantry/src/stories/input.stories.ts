import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../lib/components/card';
import { INPUT_SIZE, InputComponent } from '../lib/components/input';

const meta: Meta<InputComponent> = {
    title: 'Components/Input',
    component: InputComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, CardComponent],
        }),
    ],
    tags: ['autodocs'],
    parameters: {},
    argTypes: {
        for: {
            control: 'text',
            description: 'Identifier for the input element.',
            table: {
                defaultValue: {
                    summary: 'for',
                },
            },
        },
        label: {
            control: 'text',
            description: 'Text label for the input.',
            table: {
                defaultValue: {
                    summary: 'Default Label',
                },
            },
        },
        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input.',
            table: {
                defaultValue: {
                    summary: 'Default Placeholder',
                },
            },
        },
        inputSize: {
            control: 'select',
            description: 'Used to set input size.',
            options: INPUT_SIZE,
            table: {
                defaultValue: {
                    summary: 'medium',
                },
            },
        },
    },
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Basic: Story = {
    args: {
        for: 'for',
        label: 'Input Label',
        placeholder: 'Default Input Placeholder',
        inputSize: 'medium',
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card>
               <nctv-input
                   [for]="for"
                   [label]="label"
                   [inputSize]="inputSize"
                   [placeholder]="placeholder">
               </nctv-input>
            </nctv-card>
        `,
    }),
};

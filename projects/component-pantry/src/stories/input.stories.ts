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
        inputSize: 'medium',
        label: 'Input Label',
        placeholder: 'Default Input Placeholder',
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
               <nctv-input [label]="label" [inputSize]="inputSize" [placeholder]="placeholder"></nctv-input>
            </nctv-card>
        `,
    }),
};

import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../lib/components/card';
import { InputComponent } from '../lib/components/input';

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
    argTypes: {},
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Basic: Story = {
    args: {
        label: 'Input Label',
        placeholder: 'Default Input Placeholder',
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
               <nctv-input [label]="label" [placeholder]="placeholder"></nctv-input>
            </nctv-card>
        `,
    }),
};

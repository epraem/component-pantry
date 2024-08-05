import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../lib/components/card';
import { INPUT_SIZE, InputComponent } from '../lib/components/input';
import { ReactiveFormsModule } from '@angular/forms';

const meta: Meta<InputComponent> = {
    title: 'Components/Input',
    component: InputComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, ReactiveFormsModule, CardComponent],
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
        inputType: {
            control: 'text',
            description: 'Type of the input element.',
            table: {
                defaultValue: {
                    summary: 'text',
                },
            },
        },
        required: {
            control: 'boolean',
            description: 'Indicates whether the input is required.',
            table: {
                defaultValue: {
                    summary: 'false',
                },
            },
        },
        invalidLabel: {
            control: 'text',
            description: 'Label to display when the input is invalid.',
            table: {
                defaultValue: {
                    summary: 'This field is required*',
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
        inputType: 'email',
        required: false,
        invalidLabel: 'This field is required*',
    },
    render: (args) => ({
        props: args,
        template: `
      <nctv-card>
        <nctv-input
          [for]="for"
          [label]="label"
          [inputSize]="inputSize"
          [placeholder]="placeholder"
          [inputType]="inputType"
          [required]="required"
          [invalidLabel]="invalidLabel"
          [showInvalidLabel]="showInvalidLabel">
        </nctv-input>
      </nctv-card>
    `,
    }),
};

export const Password: Story = {
    args: {
        for: 'password',
        label: 'Password Label',
        placeholder: 'Enter your password',
        inputSize: 'medium',
        inputType: 'password',
        required: true,
        invalidLabel: 'This field is required*',
    },
    render: (args) => ({
        props: args,
        template: `
      <nctv-card>
        <nctv-input
          [for]="for"
          [label]="label"
          [inputSize]="inputSize"
          [placeholder]="placeholder"
          [inputType]="inputType"
          [required]="required"
          [invalidLabel]="invalidLabel"
          [showInvalidLabel]="showInvalidLabel">
        </nctv-input>
      </nctv-card>
    `,
    }),
};

export const Validation: Story = {
    args: {
        for: 'validation',
        label: 'Required Input',
        placeholder: 'This field is required',
        inputSize: 'medium',
        inputType: 'text',
        required: true,
        invalidLabel: 'This field is required*',
    },
    render: (args) => ({
        props: {
            ...args,
            ngAfterViewInit() {
                const inputElement = document.querySelector('input');
                if (inputElement) {
                    inputElement.addEventListener('blur', () => {
                        const control = (this as any).control();
                        control.markAsTouched();
                    });
                }
            },
        },
        template: `
      <nctv-card>
        <nctv-input
          [for]="for"
          [label]="label"
          [inputSize]="inputSize"
          [placeholder]="placeholder"
          [inputType]="inputType"
          [required]="required"
          [invalidLabel]="invalidLabel"
          [showInvalidLabel]="showInvalidLabel">
        </nctv-input>
      </nctv-card>
    `,
    }),
};

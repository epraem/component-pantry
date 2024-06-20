import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../lib/components/card';
import { AUTOCOMPLETE_INPUT_SIZE, AutocompleteComponent } from '../lib/components/autocomplete';
import { InputComponent } from '../lib/components/input';
import { ButtonComponent } from '../public-api';

const meta: Meta<AutocompleteComponent> = {
    title: 'Components/Autocomplete',
    component: AutocompleteComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, CardComponent, InputComponent, ButtonComponent],
        }),
    ],
    tags: ['autodocs'],
    parameters: {},
    argTypes: {
        inputSize: {
            control: 'select',
            description: 'Used to set input size.',
            options: AUTOCOMPLETE_INPUT_SIZE,
            table: {
                defaultValue: {
                    summary: 'medium',
                },
            },
        },
        leftIconSvg: {
            control: {
                type: 'text', // Use the 'text' control for SVG input
                // Optional, but recommended for a better UX:
                labels: {
                    control: 'Left Icon SVG',
                    description: 'Input the SVG code for the left icon.',
                },
            },
        },
        rightIconSvg: {
            control: {
                type: 'text',
                // Optional labels for better UX:
                labels: {
                    control: 'Right Icon SVG',
                    description: 'Input the SVG code for the right icon.',
                },
            },
        },
    },
};

const dummyDataCountry = [
    { id: 'abc123', name: 'Afghanistan', code: 'AF' },
    { id: 'def456', name: 'Åland Islands', code: 'AX' },
    { id: 'ghi789', name: 'Albania', code: 'AL' },
    { id: 'jkl012', name: 'Algeria', code: 'DZ' },
    { id: 'mno345', name: 'American Samoa', code: 'AS' },
    { id: 'pqr678', name: 'AndorrA', code: 'AD' },
];

export default meta;
type Story = StoryObj<AutocompleteComponent>;

export const Basic: Story = {
    args: {
        inputSize: 'medium',
        label: 'Autocomplete Field (Dynamic)',
        placeholder: 'Search Keyword',
        autocompleteData: dummyDataCountry,
        leftIconSvg: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="20px">
            <path d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`,
        rightIconSvg: `<svg width="15" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          clip-rule="evenodd"
          d="M9.53033 9.28033C9.23744 9.57322 8.76256 9.57322 8.46967 9.28033L0.96967 1.78033C0.676777 1.48744 0.676777 1.01256 0.96967 0.719671C1.26256 0.426777 1.73744 0.426777 2.03033 0.719671L9 7.68934L15.9697 0.71967C16.2626 0.426777 16.7374 0.426777 17.0303 0.71967C17.3232 1.01256 17.3232 1.48744 17.0303 1.78033L9.53033 9.28033Z"
        >
        </path>
      </svg>`,
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel" [cardSize]="'100%'">
                <nctv-autocomplete
                    [inputSize]="inputSize"
                    [label]="label"
                    [placeholder]="placeholder"
                    [autocompleteData]="autocompleteData"
                    [leftIconSvg]="leftIconSvg"
                    [rightIconSvg]="rightIconSvg"
                >
                </nctv-autocomplete>
            </nctv-card>
        `,
    }),
};

export const DemoAutocomplete: Story = {
    args: {
        inputSize: 'medium',
        label: 'Autocomplete Field (Dynamic)',
        placeholder: 'Autocomplete Field Placeholder (Dynamic)',
        autocompleteData: dummyDataCountry,
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
              <div style="display: flex; gap: 20px;">
                <nctv-autocomplete [inputSize]="inputSize" style="width: 100%;" [placeholder]="placeholder" [autocompleteData]="autocompleteData">
                </nctv-autocomplete>

                <nctv-autocomplete [inputSize]="inputSize" style="width: 100%;" [label]="'Second autocomplete (Static)'" [placeholder]="'Select animal (Static)'" [autocompleteData]="[{id: '1', name: 'Lion', species: 'Panthera leo'}, {id: '2', name: 'Tiger', species: 'Panthera tigris'}, {id: '3', name: 'Elephant', species: 'Loxodonta'}, {id: '4', name: 'Giraffe', species: 'Giraffa camelopardalis'}, {id: '5', name: 'Zebra', species: 'Equus zebra'}]">
                </nctv-autocomplete>
              </div>
            </nctv-card>
        `,
    }),
};

export const MultipleAutocomplete: Story = {
    args: {
        inputSize: 'small',
        label: 'Autocomplete Field (Dynamic)',
        placeholder: 'Autocomplete Field Placeholder (Dynamic)',
        autocompleteData: dummyDataCountry,
    },
    render: (args) => ({
        props: args,
        template: `
        <nctv-card [shadowLevel]="shadowLevel">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                <nctv-autocomplete [inputSize]="inputSize" [label]="label" [placeholder]="placeholder" [autocompleteData]="autocompleteData">
                </nctv-autocomplete>

                <nctv-input [label]="label" [inputSize]="inputSize" [placeholder]="placeholder"></nctv-input>

                <nctv-input [label]="'I am a label (Static)'" [inputSize]="inputSize" [placeholder]="'I am a placeholder (Static)'"></nctv-input>

                <nctv-input [label]="label" [inputSize]="inputSize" [placeholder]="placeholder"></nctv-input>

                <nctv-autocomplete [inputSize]="inputSize" [label]="'Second autocomplete (Static)'" [placeholder]="'Select animal (Static)'" [autocompleteData]="[{id: '1', name: 'Lion', species: 'Panthera leo'}, {id: '2', name: 'Tiger', species: 'Panthera tigris'}, {id: '3', name: 'Elephant', species: 'Loxodonta'}, {id: '4', name: 'Giraffe', species: 'Giraffa camelopardalis'}, {id: '5', name: 'Zebra', species: 'Equus zebra'}]">
                </nctv-autocomplete>

                <nctv-input [label]="'I am a label (Static)'" [inputSize]="inputSize" [placeholder]="'I am a placeholder (Static)'"></nctv-input>

                <nctv-autocomplete [inputSize]="inputSize" [label]="'Second autocomplete (Static)'" [placeholder]="'Select animal (Static)'" [autocompleteData]="[{id: '1', name: 'Lion', species: 'Panthera leo'}, {id: '2', name: 'Tiger', species: 'Panthera tigris'}, {id: '3', name: 'Elephant', species: 'Loxodonta'}, {id: '4', name: 'Giraffe', species: 'Giraffa camelopardalis'}, {id: '5', name: 'Zebra', species: 'Equus zebra'}]">
                </nctv-autocomplete>
            </div>
        </nctv-card>
        `,
    }),
};

import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../lib/components/card';
import { AutocompleteComponent } from '../lib/components/autocomplete';
const meta: Meta<AutocompleteComponent> = {
    title: 'Components/Autocomplete',
    component: AutocompleteComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, CardComponent],
        }),
    ],
    tags: ['autodocs'],
    parameters: {},
    argTypes: {},
};

const dummyData = [
    { id: 'abc123', name: 'Afghanistan', code: 'AF' },
    { id: 'def456', name: 'Åland Islands', code: 'AX' },
    { id: 'ghi789', name: 'Albania', code: 'AL' },
    { id: 'jkl012', name: 'Algeria', code: 'DZ' },
    { id: 'mno345', name: 'American Samoa', code: 'AS' },
    { id: 'pqr678', name: 'AndorrA', code: 'AD' },
    { id: 'stu901', name: 'Angola', code: 'AO' },
];

export default meta;
type Story = StoryObj<AutocompleteComponent>;

export const Basic: Story = {
    args: {
        label: '',
        autocompleteData: dummyData,
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
               <nctv-autocomplete label="Autocomplete Field" [autocompleteData]="autocompleteData">
               
               </nctv-autocomplete>
            </nctv-card>
        `,
    }),
};

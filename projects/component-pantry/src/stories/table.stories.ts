import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { COLUMN_TYPE, TableComponent, TableData } from '../lib/components/table';
import { CardComponent } from '../lib/components/card';

const dummyData = {
    columns: [
        { label: '#', sortable: false },
        { label: 'Host Name', sortable: false },
        { label: 'Dealer Name', sortable: false },
        { label: 'Address', sortable: true },
        { label: 'City', sortable: true },
        { label: 'State', sortable: true },
        { label: 'Postal Code', sortable: true },
        { label: 'Timezone', sortable: true },
        { label: 'Total License', sortable: true },
    ],
    rows: [
        [
            {
                value: 1,
            },
            {
                value: 'Amazon Data Center',
            },
            {
                value: 'Sunrise Motors Inc.',
            },
            {
                value: '456 Elm Street Apt. 201',
            },
            {
                value: 'Seattle',
            },
            {
                value: 'Washington',
            },
            {
                value: '98101',
            },
            {
                value: 'Pacific',
            },
            {
                value: 15,
            },
        ],
        [
            {
                value: 2,
            },
            {
                value: 'Microsoft Headquarters',
            },
            {
                value: 'Sunset Electronics',
            },
            {
                value: '789 Oak Avenue',
            },
            {
                value: 'Redmond',
            },
            {
                value: 'Washington',
            },
            {
                value: '98052',
            },
            {
                value: 'Pacific',
            },
            {
                value: 20,
            },
        ],
        [
            {
                value: 3,
            },
            {
                value: 'Googleplex',
            },
            {
                value: 'Skyline Solutions',
            },
            {
                value: '123 Maple Street',
            },
            {
                value: 'Mountain View',
            },
            {
                value: 'California',
            },
            {
                value: '94043',
            },
            {
                value: 'Eastern',
            },
            {
                value: 30,
            },
        ],
        [
            {
                value: 4,
            },
            {
                value: 'Apple Park',
            },
            {
                value: 'Orchard Technologies',
            },
            {
                value: '567 Pine Road',
            },
            {
                value: 'Cupertino',
            },
            {
                value: 'California',
            },
            {
                value: '95014',
            },
            {
                value: 'Mountain',
            },
            {
                value: 25,
            },
        ],
        [
            {
                value: 5,
            },
            {
                value: 'Facebook Campus',
            },
            {
                value: 'Social Solutions',
            },
            {
                value: '101 Cedar Lane',
            },
            {
                value: 'Menlo Park',
            },
            {
                value: 'California',
            },
            {
                value: '94025',
            },
            {
                value: 'Pacific',
            },
            {
                value: 18,
            },
        ],
    ],
};

const meta: Meta<TableComponent> = {
    title: 'Components/Table',
    component: TableComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule, CardComponent],
        }),
    ],
    tags: ['autodocs'],
    parameters: {},
    argTypes: {
        columnType: {
            control: 'select',
            description: 'Used to set table type.',
            options: COLUMN_TYPE,
            table: {
                defaultValue: {
                    summary: 'Full',
                },
            },
        },
        tableData: {
            control: 'select',
            description: 'Used to set shadow level, the higher the value the more prominent the shadow is.',
        },
    },
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Basic: Story = {
    args: {
        tableData: dummyData,
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
                <nctv-table [tableData]="tableData" [columnType]="columnType"></nctv-table>
            </nctv-card>
        `,
    }),
};

export const Ellipsis: Story = {
    args: {
        tableData: dummyData,
        columnType: 'ellipsis',
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
                <nctv-table [tableData]="tableData" [columnType]="columnType"></nctv-table>
            </nctv-card>
        `,
    }),
};

export const Wrap: Story = {
    args: {
        tableData: dummyData,
        columnType: 'wrap',
    },
    render: (args) => ({
        props: args,
        template: `
            <nctv-card [shadowLevel]="shadowLevel">
                <nctv-table [tableData]="tableData" [columnType]="columnType"></nctv-table>
            </nctv-card>
        `,
    }),
};

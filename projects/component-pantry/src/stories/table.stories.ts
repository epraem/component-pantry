import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { TableComponent, Table } from '../lib/components/table';

const meta: Meta<TableComponent> = {
    title: 'Components/Table',
    component: TableComponent,
    decorators: [
        moduleMetadata({
            imports: [CommonModule],
        }),
    ],
    tags: ['autodocs'],
    parameters: {},
    argTypes: {
        // shadowLevel: {
        //     control: 'select',
        //     description: 'Used to set shadow level, the higher the value the more prominent the shadow is.',
        //     options: CARD_SHADOWS,
        // }
    },
};

export default meta;
type Story = StoryObj<TableComponent>;

export const Basic: Story = {
    // args: {
    //     shadowLevel: 1,
    //     backgroundColor: '#fff',
    // },
    // render: (args) => ({
    //     props: args,
    //     template: `
    //         <nctv-card [shadowLevel]="shadowLevel" [backgroundColor]="backgroundColor">
    //             <div [style.margin-bottom.px]="'20'">
    //                 <nctv-text
    //                 [textType]="'larger'"
    //                 [textContent]="'Hello World!'">
    //                 </nctv-text>
    //             </div>
    //             <div>
    //                 <nctv-text
    //                 [textContent]="'Lorem ipsum keme keme keme 48 years chaka at bakit na ugmas mabaho nang kasi balaj sa na pranella jupang-pang shontis chapter jowabella at ang chaka at nang guash matod kasi nakakalurky na ang neuro na warla nang ugmas wasok nang shonget ang chapter , kemerloo ang shontis ng at ang intonses at nang wasok oblation sa nang 48 years shontis at bakit mahogany bongga.'">
    //                 </nctv-text>
    //             </div>
    //         </nctv-card>
    //     `,
    // }),
};

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'nctv-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent {
    tableHeaders = [
        { label: '#', sortable: false },
        { label: 'Host Name', sortable: false },
        { label: 'Dealer Name', sortable: false },
        { label: 'Address', sortable: true },
        { label: 'City', sortable: true },
        { label: 'State', sortable: true },
        { label: 'Postal Code', sortable: true },
        { label: 'Timezone', sortable: true },
        { label: 'Total License', sortable: true },
    ];

    tableData = [
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
                value: 'Pacific',
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
                value: 'Pacific',
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
    ];

    columnIndex: number = -1;
    ascending: boolean = true;

    sortColumn(columnIndex: number) {
        // Check if the selected column is sortable
        if (this.tableHeaders[columnIndex].sortable) {
            // Set the selected column index
            this.columnIndex = columnIndex;

            // Toggle the sorting order
            this.ascending = !this.ascending;

            // Sort the table data based on the selected column
            this.tableData.sort((a, b) => {
                const valueA: number | string = a[columnIndex].value;
                const valueB: number | string = b[columnIndex].value;

                // Check if the values are strings or numbers and compare accordingly
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return this.ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                } else {
                    return this.ascending ? +valueA - +valueB : +valueB - +valueA;
                }
            });
        }
    }
}

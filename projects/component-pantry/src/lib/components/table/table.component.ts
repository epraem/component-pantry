import { input, computed, signal, effect } from '@angular/core';
import { Component } from '@angular/core';
import { TableData } from './table';
import { ColumnType } from './table';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'nctv-table',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent {
    /**
     * Represents the data structure for the table, containing columns and rows.
     */
    tableData = input<TableData>({
        columns: [],
        rows: [],
    });

    /**
     * Specifies the type of columns to be displayed in the table. Possible values: 'full', 'compact'.
     * Default value is 'full'.
     */
    columnType = input<ColumnType>('full');

    /**
     * Represents the index of the currently sorted column.
     * Default value is -1, indicating no column is currently sorted.
     */
    columnIndex = signal(-1);

    /**
     * Represents the sorting order for the currently sorted column.
     * Default value is true, indicating ascending order.
     */
    ascending = signal(true);

    /**
     * Computed property to get the sorted rows based on the current column index and sorting order.
     */
    sortedRows = computed(() => {
        const data = this.tableData();
        if (this.columnIndex() < 0) return data.rows;

        const sorted = [...data.rows].sort((rowA, rowB) => {
            const valueA: any = rowA[this.columnIndex()].value;
            const valueB: any = rowB[this.columnIndex()].value;

            if (typeof valueA === 'string' && typeof valueB === 'string') {
                return this.ascending() ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
            } else {
                return this.ascending() ? +valueA - +valueB : +valueB - +valueA;
            }
        });

        return sorted;
    });

    constructor() {
        effect(() => {
            console.log(`Table data updated:`, this.tableData());
        });

        effect(() => {
            console.log(`Column index changed to: ${this.columnIndex()}`);
            console.log(`Sorting order is ascending: ${this.ascending()}`);
        });
    }

    /**
     * Sorts the table rows based on the provided column index.
     * @param columnIndex The index of the column to be sorted.
     */
    public sortColumn(columnIndex: number): void {
        if (this.tableData().columns[columnIndex].sortable) {
            this.columnIndex.set(columnIndex);
            this.ascending.update((order) => !order);
        }
    }

    /**
     * Generates class names based on the column type.
     * Constructs an object suitable for ngClass based on `columnType`.
     * @returns {Object} Object with dynamic class names
     */
    public getClass = computed(() => {
        const classes = {
            [`column--type-${this.columnType()}`]: this.columnType(),
        };
        return classes;
    });
}

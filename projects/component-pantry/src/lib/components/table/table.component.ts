import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TableData } from './table';
import { ColumnType } from './table';

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
    @Input() tableData: TableData = {
        columns: [],
        rows: [],
    };

    /**
     * Specifies the type of columns to be displayed in the table. Possible values: 'full', 'compact'.
     * Default value is 'full'.
     */
    @Input() columnType: ColumnType = 'full';

    /**
     * Represents the index of the currently sorted column.
     * Default value is -1, indicating no column is currently sorted.
     */
    columnIndex: number = -1;

    /**
     * Represents the sorting order for the currently sorted column.
     * Default value is true, indicating ascending order.
     */
    ascending: boolean = true;

    /**
     * Sorts the table rows based on the provided column index.
     * @param columnIndex The index of the column to be sorted.
     */
    public sortColumn(columnIndex: number): void {
        if (this.tableData.columns[columnIndex].sortable) {
            this.columnIndex = columnIndex;

            this.ascending = !this.ascending;

            this.tableData.rows.sort((rowA, rowB) => {
                const valueA: any = rowA[columnIndex].value;
                const valueB: any = rowB[columnIndex].value;

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    return this.ascending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                } else {
                    return this.ascending ? +valueA - +valueB : +valueB - +valueA;
                }
            });
        }
    }

    /**
     * Generates class names based on the column type.
     * Constructs an object suitable for ngClass based on `columnType`.
     * @returns {Object} Object with dynamic class names
     */
    public getClass(): object {
        const classes = {
            [`column--type-${this.columnType}`]: this.columnType,
        };

        return classes;
    }
}

// Define an interface for a single column
export interface TableColumn {
    label: string;
    sortable: boolean;
}

// Define an interface for a single row
export interface TableRow {
    value: any;
}

// Define an interface for the table data
export interface TableData {
    columns: TableColumn[];
    rows: TableRow[][];
}

export type ColumnType = 'full' | 'ellipsis' | 'wrap';
export const COLUMN_TYPE: ColumnType[] = ['full', 'ellipsis', 'wrap'];

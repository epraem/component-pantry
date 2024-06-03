export interface Days {
    name: string;
    acronym: string;
}

export interface Months {
    sequence: number;
    numericValue: string;
    name: string;
}

export interface Month_Details {
    date: number;
    dayOfTheWeek: number;
    dayString: Days;
    month: number;
    timestamp: number;
}

export interface Day_Details {
    index: number;
    numberOfDays: number;
    firstDay: number;
    year: number;
    month: number;
}

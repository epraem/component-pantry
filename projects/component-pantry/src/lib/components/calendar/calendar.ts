export interface Days {
    name: string;
    acronym: string;
}

export interface SpecificDayDetails {
    date: number;
    dayOfTheWeek: number;
    month: number;
    timestamp: number;
    dayString: Days;
}

export interface Months {
    sequence: number;
    numericValue: string;
    name: string;
}

export interface MonthDetails {
    date: number;
    dayOfTheWeek: number;
    dayString: Days;
    month: number;
    timestamp: number;
}

export interface DayDetails {
    index: number;
    numberOfDays: number;
    firstDay: number;
    year: number;
    month: number;
}

export interface DateToTimeStampParams {
    year: number;
    month: number;
    day: number;
}

export const DAYS: Days[] = [
    {
        name: 'Sunday',
        acronym: 'S',
    },
    {
        name: 'Monday',
        acronym: 'M',
    },
    {
        name: 'Tuesday',
        acronym: 'T',
    },
    {
        name: 'Wednesday',
        acronym: 'W',
    },
    {
        name: 'Thursday',
        acronym: 'TH',
    },
    {
        name: 'Friday',
        acronym: 'F',
    },
    {
        name: 'Saturday',
        acronym: 'S',
    },
];

export const MONTHS: Months[] = [
    { sequence: 0, numericValue: '1', name: 'January' },
    { sequence: 1, numericValue: '2', name: 'February' },
    { sequence: 2, numericValue: '3', name: 'March' },
    { sequence: 3, numericValue: '4', name: 'April' },
    { sequence: 4, numericValue: '5', name: 'May' },
    { sequence: 5, numericValue: '6', name: 'June' },
    { sequence: 6, numericValue: '7', name: 'July' },
    { sequence: 7, numericValue: '8', name: 'August' },
    { sequence: 8, numericValue: '9', name: 'September' },
    { sequence: 9, numericValue: '10', name: 'October' },
    { sequence: 10, numericValue: '11', name: 'November' },
    { sequence: 11, numericValue: '12', name: 'December' },
];

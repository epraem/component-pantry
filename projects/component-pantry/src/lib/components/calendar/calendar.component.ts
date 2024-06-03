import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Day_Details, Days, Month_Details, Months } from './calendar';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'nctv-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
    @ViewChild('dateInput') dateInput!: ElementRef; //Passing the value for the Date(timestamp value)
    @Input() label: string = 'Default Label'; //Specify the Calendar Label
    @Input() labelInputIcon!: string;
    @Input() addNote: any;
    @Output() dateInputValue = new EventEmitter<any>();

    currentMonth!: any;
    currentYear!: number;
    date = new Date();
    daysOfTheMonth: Month_Details[] = [];
    hasLabel = false;
    headerDate: string = '';
    headerMonth!: number;
    headerYear!: number;
    inputDateValue: string = '';
    lastSelection = false;
    sanitizedlabelInputIcon: SafeHtml | null = null;
    selectedDate!: number;
    selectedDay!: number;
    selectedMonth: any;
    selectedYear!: number;
    showArrows = true;
    showMonthAndYear = false;
    showYears = false;
    todayTimestamp!: number;
    yearEnd!: number;
    years: number[] = [];
    yearStart!: number;
    isInputActive = false;
    isDateInvalid = false;

    //Days in a week
    days: Days[] = [
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

    //Months in a year
    months: Months[] = [
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

    constructor(private sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        const oneDay = 60 * 60 * 24 * 1000; //Equation to get the Day Milliseconds
        this.todayTimestamp = Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60; //Get Current Timestamp

        const currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.getMonthByTimestamp(currentMonth);
        this.sanitizeSvgIcons();
        this.setDateHeader({ year: this.currentYear, month: currentMonth });
        this.hasLabel = this.label !== 'Default Label';
    }

    /**
     * Changes the current calendar month.
     *
     * @param {string} value - The direction to change the month ('prev' for previous, 'next' for next).
     *
     * If 'prev', decrements the month and updates the year if necessary.
     * If 'next', increments the month and updates the year if necessary.
     * Updates the header date and regenerates the year range accordingly.
     *
     * @example
     * changeCalendarMonth('prev'); // Move to the previous month
     * @example
     * changeCalendarMonth('next'); // Move to the next month
     */

    public changeCalendarMonth(value: string) {
        if (value === 'prev') {
            if (this.headerMonth === 0) {
                this.headerMonth = 11; // December
                this.headerYear -= 1; // Previous year
            } else {
                this.headerMonth -= 1; // Previous month
            }

            this.setDateHeader({ year: this.headerYear, month: this.headerMonth });

            this.yearStart -= 29;
            this.generateYears({ start: this.yearStart, end: this.yearStart + 29 });
        } else {
            if (value === 'next') {
                // Increment the month
                if (this.headerMonth === 11) {
                    this.headerMonth = 0; // January
                    this.headerYear += 1; // Next year
                } else {
                    this.headerMonth += 1; // Next month
                }

                this.setDateHeader({ year: this.headerYear, month: this.headerMonth });

                this.yearEnd += 29;
                this.generateYears({ start: this.yearEnd - 29, end: this.yearEnd });
            }
        }
    }

    /**
     * Handles changes to the date input field.
     * Updates the selected date based on the input value.
     */
    public onDateInputChange(): void {
        this.inputDateValue = this.dateInput.nativeElement.value;

        // Split the date string by any of the delimiters: /, -, or space
        const [day, month, year] = this.inputDateValue.split(/[-\/\s]/).map(Number);

        this.selectedYear = year;
        this.selectedMonth = month;

        const inputDate = new Date(year, month - 1, day);
        const inputTimestamp = inputDate.getTime();
        this.selectedDate = inputTimestamp;
    }

    /**
     * Handles the focus event on the date input field.
     * Sets the input field as active.
     */
    public onFocus(): void {
        this.isInputActive = true;
    }

    /**
     * Handles the blur event on the date input field.
     * Validates the selected date and updates the state accordingly.
     */
    public onBlur(): void {
        this.isInputActive = false;

        if (this.selectedDate) {
            this.convertTimestamp(this.selectedDate);
        } else {
            this.isDateInvalid = true;

            setTimeout(() => {
                this.isDateInvalid = false;
            }, 2000);
        }
    }

    /**
     * Toggles the display of month and year in the header.
     */
    public onClickHeaderdate(): void {
        this.showMonthAndYear = !this.showMonthAndYear;
        this.showYears = false;
        this.showArrows = !this.showArrows;
    }

    /**
     * Selects a day from the month view and updates the selected date.
     * @param day - The details of the selected day.
     */
    public onSelectDay(day: Month_Details): void {
        this.selectedDate = day.timestamp;
        this.selectedDay = day.date;

        this.convertTimestamp(day.timestamp);
    }

    /**
     * Selects a month and generates the years for the header.
     * @param month - The details of the selected month.
     */
    public onSelectMonth(month: Months): void {
        this.showYears = true;
        this.showArrows = true;
        this.selectedMonth = month.sequence;

        // Generate Years by Current Header
        let showYears = this.headerYear;
        showYears -= 8;
        this.generateYears({ start: showYears, end: showYears + 29 });
    }

    /**
     * Selects a year and updates the header.
     * @param year - The selected year.
     */
    public onSelectYear(year: number): void {
        this.showMonthAndYear = false;
        this.showArrows = true;
        this.showYears = false;
        this.selectedYear = year;
        this.setDateHeader({ year: year, month: this.selectedMonth });
    }

    /**
     * Generates an array of years for selection based on the provided range.
     * @param year - An object containing the start and end years.
     */
    private generateYears(year: { start: number; end: number }): void {
        this.yearStart = year.start;
        this.yearEnd = year.end;
        this.years = [];

        for (let fetchedYears = year.start; fetchedYears <= year.end; fetchedYears++) {
            this.years.push(fetchedYears);
        }
    }

    /**
     * Returns the number of days in a given month of a specific year.
     * @param data - An object containing the year and month.
     * @returns The number of days in the month.
     */
    private getDaysInMonth(data: { year: number; month: number }): number {
        return 40 - new Date(data.year, data.month, 40).getDate();
    }

    /**
     * Retrieves details for a specific day.
     * @param data - An object containing day details.
     * @returns An object with details of the day.
     */
    private getDayDetails(data: Day_Details): any {
        let date = data.index - data.firstDay;
        let dayOfTheWeek = data.index % 7;
        let prevMonth = data.month - 1;
        let prevYear = data.year;

        if (prevMonth < 0) {
            prevMonth = 11;
            prevYear--;
        }
        let prevMonthNumberOfDays = this.getDaysInMonth({ year: prevYear, month: prevMonth });

        let _date = (date < 0 ? prevMonthNumberOfDays + date : date % data.numberOfDays) + 1;
        let month = date < 0 ? -1 : date >= data.numberOfDays ? 1 : 0;
        let timestamp = new Date(data.year, data.month, _date).getTime();

        return {
            date: _date,
            dayOfTheWeek,
            month,
            timestamp,
            dayString: this.days[dayOfTheWeek],
        };
    }

    /**
     * Retrieves details for all days in a specific month.
     * @param data - An object containing the year and month.
     * @returns An array of objects with details of each day in the month.
     */
    private getMonthDetails(data: { year: number; month: number }): Month_Details[] {
        const year = data.year;
        const month = data.month;
        let firstDay = new Date(year, month).getDay();
        let numberOfDays = this.getDaysInMonth({ year: year, month: month });
        let monthArray: Month_Details[] = [];
        let rows = 6;
        let currentDay = null;
        let index = 0;
        let cols = 7;

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                currentDay = this.getDayDetails({
                    index,
                    numberOfDays,
                    firstDay,
                    year,
                    month,
                });
                monthArray.push(currentDay);
                index++;
            }
        }
        this.daysOfTheMonth = monthArray;

        return monthArray;
    }

    /**
     * Converts a timestamp to a date and updates the selected date fields.
     * @param timestamp - The timestamp to be converted.
     */
    private convertTimestamp(timestamp: number): void {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        this.selectedYear = year;
        this.selectedMonth = month;
        this.selectedDay = day;

        this.dateInputValue.emit(timestamp);

        if (this.selectedDate) {
            this.dateInput.nativeElement.value = `${day}/${month + 1}/${year}`;
        }

        this.setDateHeader({ year: year, month: month });
    }

    /**
     * Retrieves the month details based on a timestamp.
     * @param month - The month number.
     */
    private getMonthByTimestamp(month: number): void {
        const convertedMonth = this.months[Math.max(Math.min(11, month), 0)];
        this.currentMonth = convertedMonth;
    }

    /**
     * Sets the date header to display the selected month and year.
     * @param data - An object containing the year and month.
     */
    private setDateHeader(data: { year: number; month: number }): void {
        const convertedMonth = this.months[Math.max(Math.min(11, data.month), 0)];
        this.headerDate = `${convertedMonth.name} ${data.year}`;
        this.headerYear = data.year;
        this.headerMonth = data.month;

        this.getMonthDetails({ year: data.year, month: data.month });

        return;
    }

    /**
     * Sanitizes the SVG content for the left and right icons to prevent XSS attacks.
     */
    private sanitizeSvgIcons(): void {
        if (this.labelInputIcon) {
            this.sanitizedlabelInputIcon = this.sanitizer.bypassSecurityTrustHtml(this.labelInputIcon);
        }
    }

    /**
     * Adds a note and logs a success message to the console.
     */
    public onAddNote(): void {
        console.log('Successfully Added Notes');
    }
}

import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DAYS, DateToTimeStampParams, DayDetails, MONTHS, MonthDetails, Months, SpecificDayDetails } from './calendar';

@Component({
    selector: 'nctv-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
    /**
     * Label text for the date input component. Displayed above the input field.
     */
    @Input() label: string = 'Default Label';

    /**
     * SVG icon for the label input. Expected to be a valid SVG string.
     */
    @Input() labelInputIcon!: string;

    /**
     * Function to add a note. Expected to be a function or a callback.
     */
    @Input() addNote: any;

    /**
     * Event emitter for the value of the date input field.
     */
    @Output() dateInputValue: EventEmitter<any> = new EventEmitter<any>();

    /**
     * Reference to the date input element. Used to handle focus and input events.
     */
    @ViewChild('dateInput') dateInput!: ElementRef;

    /**
     * Current day of the month.
     */
    currentDay!: number;

    /**
     * Current month.
     */
    currentMonth!: any;

    /**
     * Current year.
     */
    currentYear!: number;

    /**
     * The date object representing the current date.
     */
    date = new Date();

    /**
     * Array containing details of each day in the month.
     */
    daysOfTheMonth: MonthDetails[] = [];

    /**
     * Array containing the names of the days of the week.
     */
    days = DAYS;

    /**
     * Flag indicating whether the input field has an associated label.
     */
    hasLabel = false;

    /**
     * Formatted date string for the header.
     */
    headerDate: string = '';

    /**
     * Month displayed in the header.
     */
    headerMonth!: number;

    /**
     * Year displayed in the header.
     */
    headerYear!: number;

    /**
     * Value of the date input field as a string.
     */
    inputDateValue: string = '';

    /**
     * Flag indicating whether the last selection was made.
     */
    lastSelection = false;

    /**
     * Array containing the names of the months.
     */
    months = MONTHS;

    /**
     * Flag indicating whether the day selection view is active.
     */
    onShowDay = false;

    /**
     * Flag indicating whether the month selection view is active.
     */
    onShowMonth = false;

    /**
     * Flag indicating whether the year selection view is active.
     */
    onShowYear = false;

    /**
     * Sanitized version of the label input icon to prevent XSS attacks.
     */
    sanitizedlabelInputIcon: SafeHtml | null = null;

    /**
     * Currently selected date.
     */
    selectedDate!: number;

    /**
     * Currently selected day.
     */
    selectedDay!: number;

    /**
     * Currently selected month.
     */
    selectedMonth: any;

    /**
     * Currently selected year.
     */
    selectedYear!: number;

    /**
     * Flag indicating whether to show arrows for navigation.
     */
    showArrows = true;

    /**
     * Flag indicating whether to show the month and year selection.
     */
    showMonthAndYear = false;

    /**
     * Flag indicating whether to show the year selection.
     */
    showYears = false;

    /**
     * Timestamp representing today's date.
     */
    todayTimestamp!: number;

    /**
     * End year for the year selection range.
     */
    yearEnd!: number;

    /**
     * Array containing the years for selection.
     */
    years: number[] = [];

    /**
     * Start year for the year selection range.
     */
    yearStart!: number;

    /**
     * Flag indicating whether the input field is active.
     */
    isInputActive = false;

    /**
     * Flag indicating whether the selected date is invalid.
     */
    isDateInvalid = false;

    constructor(private _sanitizer: DomSanitizer) {}

    ngOnInit(): void {
        const oneDay = 60 * 60 * 24 * 1000;
        const currentMonth = this.date.getMonth();
        this.hasLabel = this.label !== 'Default Label';
        this.todayTimestamp = Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60;
        this.currentYear = this.date.getFullYear();
        this.currentDay = this.date.getDate();
        this.getMonthByTimestamp(currentMonth);
        this.onDayClick();
        this.sanitizeSvgIcons();
        this.setDateHeader({ year: this.currentYear, month: currentMonth });
    }

    /**
     * Changes the current calendar month.
     * @param {string} value - The direction to change the month ('prev' for previous, 'next' for next).
     *
     * If 'prev', decrements the month and updates the year if necessary.
     * If 'next', increments the month and updates the year if necessary.
     * Updates the header date and regenerates the year range accordingly.
     *
     * @example - Move to the previous month
     * changeCalendarMonth('prev');
     *
     * @example - Move to the next month
     * changeCalendarMonth('next');
     */
    public changeCalendarMonth(value: string): void {
        if (value === 'prev') {
            if (this.headerMonth === 0) {
                this.headerMonth = 11;
                this.headerYear -= 1;
            } else {
                this.headerMonth -= 1;
            }

            this.setDateHeader({ year: this.headerYear, month: this.headerMonth });
            this.yearStart -= 29;
            this.generateYears({ start: this.yearStart, end: this.yearStart + 29 });

            return;
        }

        if (this.headerMonth === 11) {
            this.headerMonth = 0;
            this.headerYear += 1;
        } else {
            this.headerMonth += 1;
        }

        this.setDateHeader({ year: this.headerYear, month: this.headerMonth });
        this.yearEnd += 29;
        this.generateYears({ start: this.yearEnd - 29, end: this.yearEnd });
    }

    /**
     * Handles changes to the date input field.
     * Updates the selected date based on the input value.
     */
    public onDateInputChang(): void {
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
     * Handles the click event for showing days.
     * Sets `onShowDay` to true, and hides month and year views.
     */
    public onDayClick(): void {
        this.onShowDay = true;
        this.onShowMonth = false;
        this.onShowYear = false;
    }

    /**
     * Handles the click event for showing months.
     * Sets `onShowMonth` to true, hides day and year views, and disables arrows.
     */
    public onMonthClick() {
        this.onShowMonth = true;
        this.onShowDay = false;
        this.onShowYear = false;
        this.showArrows = false;
    }

    /**
     * Handles the click event for showing years.
     * Sets `onShowYear` to true, hides day and month views, enables year view and arrows.
     * Generates a range of years based on the current header year, starting from 8 years before the header year to 21 years after.
     */
    public onYearClick(): void {
        this.onShowYear = true;
        this.onShowMonth = false;
        this.onShowDay = false;
        this.showYears = true;
        this.showArrows = true;

        // Generate Years by Current Header
        let showYears = this.headerYear;
        showYears -= 8;
        this.generateYears({ start: showYears, end: showYears + 29 });
    }

    /**
     * Selects a day from the month view and updates the selected date.
     * @param day - The details of the selected day.
     */
    public onDaySelect(day: MonthDetails): void {
        this.selectedDate = day.timestamp;
        this.selectedDay = day.date;
        this.onShowMonth = false;
        this.onShowYear = false;
        this.convertTimestamp(day.timestamp);
    }

    /**
     * Selects a month and generates the years for the header.
     * @param month - The details of the selected month.
     */
    public onMonthSelected(month: Months): void {
        this.showYears = true;
        this.selectedMonth = month.sequence;
        this.onShowDay = true;
        this.onShowMonth = false;

        if (!this.selectedYear || !this.selectedDay) {
            this.setInitialDateHeaderAndTimestamp(this.currentYear, this.selectedMonth);
        }

        this.updateTimestampAndHeader(this.selectedDay, this.currentYear, this.selectedMonth);
    }

    /**
     * Selects a year and updates the header.
     * @param year - The selected year.
     */
    public onYearSelected(year: number): void {
        this.showMonthAndYear = false;
        this.showYears = false;
        this.selectedYear = year;
        this.onShowDay = true;
        this.onShowYear = false;

        if (!this.selectedDay || !this.selectedMonth) {
            this.setInitialDateHeaderAndTimestamp(this.selectedYear, this.currentMonth);
        }

        this.updateTimestampAndHeader(this.selectedDay, this.selectedYear, this.selectedMonth);
    }

    /**
     * Sets initial date header and timestamp.
     * @param year - The year value.
     * @param month - The month value.
     */

    private setInitialDateHeaderAndTimestamp(year: number, month: number): void {
        this.setDateHeader({ year, month });
        this.convertToTimeStamp({ year, month, day: 1 });
    }

    /**
     * Updates timestamp and header.
     * @param day - The day value.
     * @param year - The year value.
     * @param month - The month value.
     */

    private updateTimestampAndHeader(day: number, year: number, month: number): void {
        this.convertToTimeStamp({ year, month, day });
        this.setDateHeader({ year, month });
    }

    /**
     * Converts a date object to a timestamp and processes it.
     *
     * @param {Object} data - The date data to convert.
     * @param {number} data.year - The year of the date.
     * @param {number} data.month - The month of the date (0-11, where 0 is January and 11 is December).
     * @param {number} data.day - The day of the month.
     */
    private convertToTimeStamp(data: DateToTimeStampParams): void {
        const inputDate = new Date(data.year, data.month, data.day);
        const inputTimestamp = inputDate.getTime();
        this.convertTimestamp(inputTimestamp);
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
    private getDayDetails(data: DayDetails): SpecificDayDetails {
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
    private getMonthDetails(data: { year: number; month: number }): MonthDetails[] {
        const year = data.year;
        const month = data.month;
        let firstDay = new Date(year, month).getDay();
        let numberOfDays = this.getDaysInMonth({ year: year, month: month });
        let monthArray: MonthDetails[] = [];
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
        this.selectedDate = timestamp;
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
            this.sanitizedlabelInputIcon = this._sanitizer.bypassSecurityTrustHtml(this.labelInputIcon);
        }
    }

    /**
     * Adds a note and logs a success message to the console.
     */
    public onAddNote(): void {
        console.log('Successfully Added Notes');
    }
}

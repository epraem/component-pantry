import { Component, ElementRef, OnInit, viewChild, input, output, model, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DAYS, DateToTimeStampParams, DayDetails, MONTHS, MonthDetails, Months, SpecificDayDetails } from './calendar';

@Component({
    selector: 'nctv-calendar',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
    /** Label for the calendar component */
    label = input<string>('Default Label');

    /** Icon for the label input */
    labelInputIcon = input<string | undefined>();

    /** Function to add a note */
    addNote = input<Function>();

    /** Output value for the date input */
    dateInputValue = output<any>();

    /** Reference to the date input element */
    dateInput = viewChild<ElementRef>('dateInput');

    /** Current day */
    currentDay = model<number>();

    /** Current month */
    currentMonth = model<any>();

    /** Current year */
    currentYear = model<number>(new Date().getFullYear());

    /** Current date object */
    date = new Date();

    /** Days of the current month */
    daysOfTheMonth = model<MonthDetails[]>([]);

    /** Array of days in a week */
    days = DAYS;

    /** Computed property to check if the label is not default */
    hasLabel = computed(() => this.label() !== 'Default Label');

    /** Header date string */
    headerDate = model<string>('');

    /** Header month number */
    headerMonth = model<number>(new Date().getMonth());

    /** Header year number */
    headerYear = model<number>(new Date().getFullYear());

    /** Input value for the date */
    inputDateValue = model<string>('');

    /** Flag for the last selection */
    lastSelection = model<boolean>(false);

    /** Array of months */
    months = MONTHS;

    /** Flag to show day picker */
    onShowDay = model<boolean>(false);

    /** Flag to show month picker */
    onShowMonth = model<boolean>(false);

    /** Flag to show year picker */
    onShowYear = model<boolean>(false);

    /** Sanitized icon for the label input */
    sanitizedlabelInputIcon = model<SafeHtml | null>(null);

    /** Selected date timestamp */
    selectedDate = model<number>();

    /** Selected day */
    selectedDay = model<number>();

    /** Selected month */
    selectedMonth = model<any>();

    /** Selected year */
    selectedYear = model<number>();

    /** Flag to show arrows in the UI */
    showArrows = model<boolean>(true);

    /** Flag to show month and year in the header */
    showMonthAndYear = model<boolean>(false);

    /** Flag to show years picker */
    showYears = model<boolean>(false);

    /** Today's timestamp */
    todayTimestamp = model<number>();

    /** End year for the picker */
    yearEnd = model<number>(new Date().getFullYear() + 10);

    /** Array of years for the picker */
    years = model<number[]>([]);

    /** Start year for the picker */
    yearStart = model<number>(new Date().getFullYear());

    /** Flag to check if input is active */
    isInputActive = model<boolean>(false);

    /** Flag to check if the date is invalid */
    isDateInvalid = model<boolean>(false);

    /**
     * Constructor to inject the sanitizer service
     * @param {DomSanitizer} _sanitizer - The sanitizer service
     */
    constructor(private _sanitizer: DomSanitizer) {}

    /**
     * Initialize the calendar component
     */
    ngOnInit(): void {
        const oneDay = 60 * 60 * 24 * 1000;
        const currentMonth = this.date.getMonth();
        const currentYear = this.date.getFullYear();
        const currentDay = this.date.getDate();
        const maxYear = currentYear + 100;
        const minYear = 1900;

        this.todayTimestamp.set(Date.now() - (Date.now() % oneDay) + new Date().getTimezoneOffset() * 1000 * 60);
        this.currentYear.set(currentYear);
        this.currentDay.set(currentDay);
        this.headerYear.set(currentYear);
        this.headerMonth.set(currentMonth);
        this.yearEnd.set(maxYear); // Set max year to current year + 100
        this.yearStart.set(minYear); // Set min year to 1900
        this.getMonthByTimestamp(currentMonth);
        this.generateYears({ start: minYear, end: maxYear });
        this.onDayClick();
        this.sanitizeSvgIcons();
        this.setInitialDate();

        // Ensure the current day is selected initially
        this.selectedDay.set(currentDay);
        this.selectedMonth.set(currentMonth + 1); // JavaScript months are 0-based
        this.selectedYear.set(currentYear);
        this.selectedDate.set(this.date.getTime());

        this.setDateHeader({ year: this.currentYear(), month: currentMonth });
    }

    /**
     * Set the initial date in the input field
     */
    private setInitialDate(): void {
        const today = new Date();
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        const dateInputElement = this.dateInput();
        if (dateInputElement instanceof ElementRef) {
            dateInputElement.nativeElement.value = formattedDate;
        }

        this.selectedYear.set(year);
        this.selectedMonth.set(Number(month));
        this.selectedDay.set(Number(day));
        this.selectedDate.set(today.getTime());
    }

    /**
     * Change the calendar month
     * @param {string} value - The value to change the month ('prev' or 'next')
     */
    public changeCalendarMonth(value: string): void {
        const headerYear = this.headerYear();
        const headerMonth = this.headerMonth();
        const yearStart = this.yearStart();
        const yearEnd = this.yearEnd();

        if (headerYear === undefined || headerMonth === undefined || yearStart === undefined || yearEnd === undefined) {
            return;
        }

        if (value === 'prev') {
            if (headerMonth === 0) {
                this.headerMonth.set(11);
                this.headerYear.set(headerYear - 1);
            } else {
                this.headerMonth.set(headerMonth - 1);
            }

            this.setDateHeader({ year: this.headerYear()!, month: this.headerMonth()! });
            this.yearStart.set(yearStart - 29);
            this.generateYears({ start: this.yearStart()!, end: this.yearStart()! + 29 });

            return;
        }

        if (headerMonth === 11) {
            this.headerMonth.set(0);
            this.headerYear.set(headerYear + 1);
        } else {
            this.headerMonth.set(headerMonth + 1);
        }

        this.setDateHeader({ year: this.headerYear()!, month: this.headerMonth()! });
        this.yearEnd.set(yearEnd + 29);
        this.generateYears({ start: this.yearEnd()! - 29, end: this.yearEnd()! });
    }

    /**
     * Handle date input change and format input with slashes
     * @param {Event} event - The input event
     */
    public onDateInputChange(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        let textSoFar = inputElement.value;

        // Remove non-numeric characters except slashes
        textSoFar = textSoFar.replace(/[^\d\/]/g, '');

        // Insert slashes at the correct positions
        if (textSoFar.length > 2 && textSoFar[2] !== '/') {
            textSoFar = textSoFar.slice(0, 2) + '/' + textSoFar.slice(2);
        }
        if (textSoFar.length > 5 && textSoFar[5] !== '/') {
            textSoFar = textSoFar.slice(0, 5) + '/' + textSoFar.slice(5);
        }
        // Limit the year to 4 digits
        if (textSoFar.length > 10) {
            textSoFar = textSoFar.slice(0, 10);
        }

        inputElement.value = textSoFar;

        const [day, month, year] = textSoFar.split('/').map(Number);

        if (year !== undefined && month !== undefined && day !== undefined) {
            const currentYear = new Date().getFullYear();
            const maxYear = currentYear + 100;
            if (year <= maxYear && year >= 1900) {
                this.selectedYear.set(year);
                this.selectedMonth.set(month);

                const inputDate = new Date(year, month - 1, day);
                const inputTimestamp = inputDate.getTime();
                this.selectedDate.set(inputTimestamp);
                this.isDateInvalid.set(false);
            } else {
                // Handle invalid year
                this.isDateInvalid.set(true);
                setTimeout(() => {
                    this.isDateInvalid.set(false);
                }, 2000);
            }
        } else if (!textSoFar) {
            this.isDateInvalid.set(true);
        } else {
            this.isDateInvalid.set(true);
        }
    }

    /**
     * Handle focus event on the input
     */
    public onFocus(): void {
        this.isInputActive.set(true);
    }

    /**
     * Handle blur event on the input
     */
    public onBlur(): void {
        this.isInputActive.set(false);

        const dateInputRef = this.dateInput();
        if (dateInputRef && !dateInputRef.nativeElement.value) {
            this.isDateInvalid.set(true);
            this.selectedYear.set(new Date().getFullYear());
            this.selectedMonth.set(new Date().getMonth());
            this.selectedDay.set(new Date().getDate());
            this.convertTimestamp(Date.now());
            dateInputRef.nativeElement.value = this.formatDate(new Date());
        } else if (this.selectedDate() !== undefined) {
            this.convertTimestamp(this.selectedDate()!);
        } else {
            this.isDateInvalid.set(true);

            setTimeout(() => {
                this.isDateInvalid.set(false);
            }, 2000);
        }
    }

    /**
     * Format a date object to a string with leading zeros
     * @param {Date} date - The date to format
     * @returns {string} The formatted date string
     */
    private formatDate(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
    }

    /**
     * Handle click event on the header date
     */
    public onClickHeaderdate(): void {
        this.showMonthAndYear.set(!this.showMonthAndYear());
        this.showYears.set(false);
        this.showArrows.set(!this.showArrows());
    }

    /**
     * Handle day click event
     */
    public onDayClick(): void {
        this.onShowDay.set(true);
        this.onShowMonth.set(false);
        this.onShowYear.set(false);
    }

    /**
     * Handle month click event
     */
    public onMonthClick(): void {
        this.onShowMonth.set(true);
        this.onShowDay.set(false);
        this.onShowYear.set(false);
        this.showArrows.set(false);
    }

    /**
     * Handle year click event
     */
    public onYearClick(): void {
        this.onShowYear.set(true);
        this.onShowMonth.set(false);
        this.onShowDay.set(false);
        this.showYears.set(true);
        this.showArrows.set(true);

        let showYears = this.headerYear();
        if (showYears !== undefined) {
            showYears -= 8;
            this.generateYears({ start: showYears, end: showYears + 29 });
        }
    }

    /**
     * Handle day selection
     * @param {MonthDetails} day - The details of the selected day
     */
    public onDaySelect(day: MonthDetails): void {
        this.selectedDate.set(day.timestamp);
        this.selectedDay.set(day.date);
        this.onShowMonth.set(false);
        this.onShowYear.set(false);
        this.convertTimestamp(day.timestamp);
    }

    /**
     * Handle month selection
     * @param {Months} month - The selected month
     */
    public onMonthSelected(month: Months): void {
        this.showYears.set(true);
        this.selectedMonth.set(month.sequence);
        this.onShowDay.set(true);
        this.onShowMonth.set(false);

        if (!this.selectedYear() || !this.selectedDay()) {
            this.setInitialDateHeaderAndTimestamp(this.currentYear()!, this.selectedMonth()!);
        }

        this.updateTimestampAndHeader(this.selectedDay()!, this.currentYear()!, this.selectedMonth()!);
    }

    /**
     * Handle year selection
     * @param {number} year - The selected year
     */
    public onYearSelected(year: number): void {
        this.showMonthAndYear.set(false);
        this.showYears.set(false);
        this.selectedYear.set(year);
        this.onShowDay.set(true);
        this.onShowYear.set(false);

        if (!this.selectedDay() || !this.selectedMonth()) {
            this.setInitialDateHeaderAndTimestamp(this.selectedYear()!, this.currentMonth()!);
        }

        this.updateTimestampAndHeader(this.selectedDay()!, this.selectedYear()!, this.selectedMonth()!);
    }

    /**
     * Set initial date header and timestamp
     * @param {number} year - The year to set
     * @param {number} month - The month to set
     */
    private setInitialDateHeaderAndTimestamp(year: number, month: number): void {
        this.setDateHeader({ year, month });
        this.convertToTimeStamp({ year, month, day: 1 });
    }

    /**
     * Update timestamp and header
     * @param {number} day - The day to set
     * @param {number} year - The year to set
     * @param {number} month - The month to set
     */
    private updateTimestampAndHeader(day: number, year: number, month: number): void {
        this.convertToTimeStamp({ year, month, day });
        this.setDateHeader({ year, month });
    }

    /**
     * Convert date to timestamp
     * @param {DateToTimeStampParams} data - The date data to convert
     */
    private convertToTimeStamp(data: DateToTimeStampParams): void {
        const inputDate = new Date(data.year, data.month, data.day);
        const inputTimestamp = inputDate.getTime();
        this.convertTimestamp(inputTimestamp);
    }

    /**
     * Generate years for the picker
     * @param {Object} year - The start and end year
     * @param {number} year.start - The start year
     * @param {number} year.end - The end year
     */
    private generateYears(year: { start: number; end: number }): void {
        const currentYear = new Date().getFullYear();
        const maxYear = currentYear + 100;
        const minYear = 1900;

        // Ensure the start year does not go below min year and end year does not exceed max year
        const adjustedStartYear = Math.max(year.start, minYear);
        const adjustedEndYear = Math.min(year.end, maxYear);

        this.yearStart.set(adjustedStartYear);
        this.yearEnd.set(adjustedEndYear);

        const yearsArray: number[] = [];
        for (let fetchedYears = adjustedStartYear; fetchedYears <= adjustedEndYear; fetchedYears++) {
            yearsArray.push(fetchedYears);
        }

        this.years.set(yearsArray);
    }

    /**
     * Get the number of days in a month
     * @param {Object} data - The year and month data
     * @param {number} data.year - The year
     * @param {number} data.month - The month
     * @returns {number} The number of days in the month
     */
    private getDaysInMonth(data: { year: number; month: number }): number {
        return 40 - new Date(data.year, data.month, 40).getDate();
    }

    /**
     * Get the details of a specific day
     * @param {DayDetails} data - The day details data
     * @returns {SpecificDayDetails} The specific day details
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
     * Get the details of a month
     * @param {Object} data - The year and month data
     * @param {number} data.year - The year
     * @param {number} data.month - The month
     * @returns {MonthDetails[]} The details of the month
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

        this.daysOfTheMonth.set(monthArray);
        return monthArray;
    }

    /**
     * Convert timestamp to date and update relevant fields
     * @param {number} timestamp - The timestamp to convert
     */
    private convertTimestamp(timestamp: number): void {
        const date = new Date(timestamp);
        const day = date.getDate();
        const month = date.getMonth() + 1; // JavaScript months are 0-based
        const year = date.getFullYear();
        const formattedDay = day.toString().padStart(2, '0');
        const formattedMonth = month.toString().padStart(2, '0');

        this.selectedYear.set(year);
        this.selectedMonth.set(month);
        this.selectedDay.set(day);
        this.selectedDate.set(timestamp);
        this.dateInputValue.emit(timestamp);

        if (this.selectedDate() !== undefined && this.dateInput() !== undefined) {
            this.dateInput()!.nativeElement.value = `${formattedDay}/${formattedMonth}/${year}`;
        }
        this.setDateHeader({ year: year, month: month - 1 }); // Adjust month to 0-based for setDateHeader
    }

    /**
     * Get the month by its timestamp
     * @param {number} month - The month number
     */
    private getMonthByTimestamp(month: number): void {
        const convertedMonth = this.months[Math.max(Math.min(11, month), 0)];
        this.currentMonth.set(convertedMonth);
    }

    /**
     * Set the date header
     * @param {Object} data - The year and month data
     * @param {number} data.year - The year
     * @param {number} data.month - The month
     */
    private setDateHeader(data: { year: number; month: number }): void {
        const convertedMonth = this.months[Math.max(Math.min(11, data.month), 0)];
        const day = this.selectedDay(); // Assume selectedDay is always set now
        this.headerDate.set(`${convertedMonth.name} ${day}, ${data.year}`);
        this.headerYear.set(data.year);
        this.headerMonth.set(data.month);
        this.getMonthDetails({ year: data.year, month: data.month });
    }

    /**
     * Sanitize SVG icons for the label input
     */
    private sanitizeSvgIcons(): void {
        if (this.labelInputIcon() !== undefined) {
            this.sanitizedlabelInputIcon.set(this._sanitizer.bypassSecurityTrustHtml(this.labelInputIcon()!));
        }
    }

    /**
     * Add a note (stub function for future implementation)
     */
    public onAddNote(): void {
        console.log('Successfully Added Notes');
    }
}

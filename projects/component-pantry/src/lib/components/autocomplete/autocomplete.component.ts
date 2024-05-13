import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { map, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/** Autocomplete Component */
@Component({
    selector: 'nctv-autocomplete',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    /** Input field ID */
    @Input() for: string = 'for';
    /** Input label */
    @Input() label: string = 'Default Label';
    /** Input placeholder */
    @Input() placeholder: string = 'Default Placeholder';
    /** Input size */
    @Input() inputSize: string = 'medium';
    /** Title */
    @Input() title: string = 'Default Title';
    /** Autocomplete data */
    @Input() autocompleteData: any[] = [];
    /** Left icon SVG */
    @Input() leftIconSvg: string | null = null;
    /** Right icon SVG */
    @Input() rightIconSvg: string | null = null;
    /** Flag to show left icon */
    @Input() showLeftIcon = true;
    /** Flag to show right icon */
    @Input() showRightIcon = true;
    /** Sanitized left icon SVG */
    sanitizedLeftIconSvg: SafeHtml | null = null;
    /** Sanitized right icon SVG */
    sanitizedRightIconSvg: SafeHtml | null = null;
    /** Selected option */
    selectedOption: any;
    /** Filtered data */
    filteredData: any[] = [];
    /** Flag indicating if label is present */
    hasLabel: boolean = false;
    /** Flag indicating if autocomplete is active */
    isActive: boolean = false;
    /** Subject for search */
    searchSubject = new Subject<string>();
    /** Display the input */
    showInput = true;

    constructor(private sanitizer: DomSanitizer) {}

    @ViewChild('dropdownWrapper', { static: true }) dropdownWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

    ngOnInit() {
        this.filteredData = this.autocompleteData;
        this.hasLabel = !!this.label.trim().length;

        this.searchSubject
            .pipe(debounceTime(300))
            .subscribe((searchText) => {
                this.filterData(searchText);
            });

        this.updateIconVisibility();
    }

    private filterData(searchText: string) {
        this.filteredData = this.autocompleteData.filter((option) =>
            option.name.toLowerCase().includes(searchText.toLowerCase()),
        );
    }

    ngOnChanges() {
        this.updateIconVisibility(); // Call to update visibility on changes
        this.sanitizeSvgIcons();
    }

    private updateIconVisibility() {
        this.showLeftIcon = !!this.leftIconSvg;
        this.showRightIcon = !!this.rightIconSvg;
    }

    private sanitizeSvgIcons() {
        if (this.leftIconSvg) {
            this.sanitizedLeftIconSvg = this.sanitizer.bypassSecurityTrustHtml(this.leftIconSvg);
        }
        if (this.rightIconSvg) {
            this.sanitizedRightIconSvg = this.sanitizer.bypassSecurityTrustHtml(this.rightIconSvg);
        }
    }

    /** Handle option selection */
    optionSelect(option: any) {
        this.selectedOption = option;
        this.showInput = false; // Hide the input
        console.log('Selected option:', this.selectedOption);
        this.isActive = false;
        this.toggleDropdown();
        this.filteredData = this.autocompleteData;
    }

    /** Clear selected option and show input */
    clearSelection() {
        this.selectedOption = null;
        this.showInput = true; // Show the input again
    }

    ngAfterViewInit() {
        this.searchInput.nativeElement.addEventListener('focus', () => {
            this.isActive = true;
            this.toggleDropdown();
        });

        fromEvent(this.searchInput.nativeElement, 'input')
            .pipe(
                map((event: any) => event.target.value),
                debounceTime(300),
                distinctUntilChanged(),
            )
            .subscribe((searchText) => {
                this.handleSearch(searchText);
            });

        fromEvent(document, 'click')
            .pipe(
                filter((event: any) => {
                    const target = event.target;
                    return (
                        !this.dropdownWrapper.nativeElement.contains(target) &&
                        !this.searchInput.nativeElement.contains(target)
                    );
                }),
            )
            .subscribe(() => {
                this.isActive = false;
                this.toggleDropdown();
            });
    }

    /** Handle search */
    handleSearch(searchText: string) {
        this.searchSubject.next(searchText);
    }

    /** Toggle dropdown visibility */
    toggleDropdown() {
        const dropdownElement = this.dropdownWrapper.nativeElement;
        dropdownElement.classList.toggle('active', this.isActive);
        dropdownElement.classList.toggle('inactive', !this.isActive);
    }

    /** Get class based on input size */
    getClass(): object {
        return {
            [`input--${this.inputSize}`]: this.inputSize,
        };
    }
}

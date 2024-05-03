import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
    selector: 'nctv-autocomplete',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    /**
     * Identifier for the autocomplete input element.
     */
    @Input() for: string = 'for';

    /**
     * Text label for the autocomplete input.
     */
    @Input() label: string = 'Default Label';

    /**
     * Placeholder text for the autocomplete input.
     */
    @Input() placeholder: string = 'Default Placeholder';

    /**
     * Size of the autocomplete input element (e.g., small, medium, large).
     */
    @Input() inputSize: string = 'medium';

    /**
     * Title for the autocomplete dropdown.
     */
    @Input() title: string = 'Default Title';

    /**
     * Data for autocomplete suggestions.
     */
    @Input() autocompleteData: any[] = [];

    /**
     * Filtered data based on user input.
     */
    filteredData: any[] = [];

    /**
     * Indicates whether the autocomplete input has a label.
     */
    hasLabel: boolean = false;

    /**
     * Indicates whether the autocomplete dropdown is currently active.
     */
    isActive: boolean = false;

    /**
     * Reference to the dropdown wrapper element.
     */
    @ViewChild('dropdownWrapper', { static: true }) dropdownWrapper!: ElementRef<HTMLDivElement>;

    /**
     * Reference to the dropdown toggle element.
     */
    @ViewChild('dropdownToggle', { static: true }) dropdownToggle!: ElementRef<HTMLDivElement>;

    ngOnInit() {
        // Initialize filteredData with autocompleteData
        this.filteredData = this.autocompleteData;

        // Check if a label is provided, set hasLabel accordingly
        if (this.label.length) {
            this.hasLabel = true;
        }
    }

    ngAfterViewInit() {
        // Add click event listener to dropdown toggle element
        this.dropdownToggle.nativeElement.addEventListener('click', () => {
            // Toggle isActive and update dropdown visibility
            this.isActive = !this.isActive;
            this.toggleDropdown();
        });
    }

    /**
     * Toggles the visibility of the autocomplete dropdown.
     */
    toggleDropdown() {
        const dropdownElement = this.dropdownWrapper.nativeElement;
        if (this.isActive) {
            dropdownElement.classList.add('active');
            dropdownElement.classList.remove('inactive');
        } else {
            dropdownElement.classList.remove('active');
            dropdownElement.classList.add('inactive');
        }
    }

    /**
     * Filters autocomplete data based on user input.
     * @param searchText The text entered by the user in the autocomplete input.
     */
    filterData(searchText: string) {
        this.filteredData = this.autocompleteData.filter((option: { name: string }) =>
            option.name.toLowerCase().includes(searchText.toLowerCase()),
        );
    }

    /**
     * Handles selection of an option from the autocomplete dropdown.
     * @param option The selected option.
     */
    optionSelect(option: { id: string; name: string }) {
        const dropdownHeader = this.dropdownWrapper.nativeElement.querySelector('.dropdown--header span');
        if (dropdownHeader) {
            // Update dropdown header with selected option
            dropdownHeader.textContent = `${option.name} |  (ID : ${option.id} ~ for testing purposes only)`;
        }
        this.isActive = false; // Close dropdown after selection
        this.toggleDropdown(); // Toggle dropdown visibility
    }

    /**
     * Dynamically generates class names based on inputSize.
     * @returns {Object} Object with dynamic class names.
     */
    getClass(): object {
        const classes = {
            [`input--${this.inputSize}`]: this.inputSize,
        };
        return classes;
    }
}

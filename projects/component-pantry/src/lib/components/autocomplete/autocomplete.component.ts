import { CommonModule } from '@angular/common';
import {
    Component,
    OnInit,
    ElementRef,
    ChangeDetectorRef,
    HostListener,
    computed,
    effect,
    input,
    viewChild,
    viewChildren,
} from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'nctv-autocomplete',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
    /**
     * ID for the associated input element. Used for accessibility purposes.
     */
    for = input<string>('for');

    /**
     * Data source for the autocomplete suggestions. Expected to be an array of objects.
     */
    autocompleteData = input<any[]>([]);

    /**
     * SVG icon displayed to the left of the input field. Expected to be a valid SVG string.
     */
    leftIconSvg = input<string | null>(null);

    /**
     * SVG icon displayed to the right of the input field. Expected to be a valid SVG string.
     */
    rightIconSvg = input<string | null>(null);

    /**
     * Flag indicating whether to show the left icon.
     */
    showLeftIcon = computed(() => !!this.leftIconSvg());

    /**
     * Flag indicating whether to show the right icon.
     */
    showRightIcon = computed(() => !!this.rightIconSvg());

    /**
     * Label text for the autocomplete component. Displayed above the input field.
     */
    label = input<string>('Default Label');

    /**
     * Placeholder text for the input field. Displayed when the input is empty.
     */
    placeholder = input<string>('Default Placeholder');

    /**
     * Size of the input field. Accepted values are 'small', 'medium', 'large'.
     */
    inputSize = input<string>('medium');

    /**
     * Title text for the autocomplete component. Displayed as a tooltip or heading.
     */
    title = input<string>('Default Title');

    /**
     * Reference to the dropdown wrapper element. Used to control the visibility and positioning of the dropdown.
     */
    dropdownWrapper = viewChild<ElementRef<HTMLDivElement>>('dropdownWrapper');

    /**
     * Reference to the search input element. Used to handle focus and input events.
     */
    searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

    /**
     * Flag indicating whether the label should be displayed.
     */
    hasLabel = computed(() => !!this.label().trim().length);

    /**
     * Flag indicating whether the dropdown is currently active (visible).
     */
    isActive = false;

    /**
     * Sanitized version of the left icon SVG to prevent XSS attacks.
     */
    sanitizedLeftIconSvg: SafeHtml | null = null;

    /**
     * Sanitized version of the right icon SVG to prevent XSS attacks.
     */
    sanitizedRightIconSvg: SafeHtml | null = null;

    /**
     * Currently selected option from the autocomplete suggestions.
     */
    selectedOption: any;

    /**
     * Filtered list of autocomplete suggestions based on the search input.
     */
    filteredData: any[] = [];

    /**
     * Subject to handle debounce of search input changes.
     */
    searchSubject = new Subject<string>();

    /**
     * Flag indicating whether to show the input field.
     */
    showInput = true;

    /**
     * Subject to handle changes in the search input value.
     */
    searchInputChanges$ = new Subject<string>();

    constructor(
        private sanitizer: DomSanitizer,
        private cdr: ChangeDetectorRef,
    ) {
        // Reactive effect to sanitize SVG icons whenever they change
        effect(() => {
            this.sanitizeSvgIcons();
        });
    }

    ngOnInit() {
        this.filteredData = this.autocompleteData();
        this.searchSubject.pipe(debounceTime(100)).subscribe({
            next: (searchText: string) => {
                this.filteredData = this.autocompleteData().filter((option) =>
                    option.name.toLowerCase().includes(searchText.toLowerCase()),
                );
            },
        });

        this.searchInputChanges$.pipe(debounceTime(100), distinctUntilChanged()).subscribe({
            next: (searchText: string) => {
                this.isActive = true;
                this.handleSearch(searchText);
            },
        });
    }

    /**
     * HostListener for detecting clicks outside the component to close the dropdown.
     * @param targetElement The element that was clicked.
     */
    @HostListener('document:click', ['$event.target'])
    public onClickOutside(targetElement: any): void {
        const dropdownWrapper = this.dropdownWrapper();
        const searchInput = this.searchInput();
        const clickedInside =
            (dropdownWrapper && dropdownWrapper.nativeElement.contains(targetElement)) ||
            (searchInput && searchInput.nativeElement.contains(targetElement));

        if (!clickedInside && this.isActive) {
            this.isActive = false;

            // Reset the input and show it again only if there's no selected option.
            if (!this.selectedOption) {
                this.showInput = true;
                this.attachInputEventListener(); // Ensure the event listener is re-attached.

                // Clear the input value after the view is updated and trigger input event.
                setTimeout(() => {
                    if (searchInput && searchInput.nativeElement) {
                        searchInput.nativeElement.value = '';
                        searchInput.nativeElement.dispatchEvent(new Event('input'));
                    }
                });
            } else {
                // Dropdown is being closed with a selected option.
                this.toggleDropdown();
            }
        }
    }

    /**
     * HostListener for detecting the escape key press to close the dropdown.
     * @param event The keyboard event.
     */
    @HostListener('window:keydown.escape', ['$event'])
    public onEscapeKeydown(event: KeyboardEvent): void {
        if (this.isActive) {
            this.isActive = false;
            if (!this.selectedOption) {
                this.showInput = true;
                this.attachInputEventListener();

                setTimeout(() => {
                    const searchInput = this.searchInput();
                    if (searchInput && searchInput.nativeElement) {
                        searchInput.nativeElement.value = '';
                        searchInput.nativeElement.dispatchEvent(new Event('input'));
                    }
                });
            } else {
                this.toggleDropdown();
            }
        }
    }

    /**
     * Handles the selection of an option from the autocomplete suggestions.
     * @param option The selected option.
     */
    public optionSelect(option: any): void {
        this.selectedOption = option;
        this.showInput = false;
        this.isActive = false;
        this.toggleDropdown();
        this.filteredData = this.autocompleteData();
    }

    /**
     * Clears the current selection and resets the input field.
     */
    public clearSelection(): void {
        this.selectedOption = null;
        this.showInput = true;
        this.filteredData = this.autocompleteData();

        // Clear input and trigger search AFTER the view is updated
        setTimeout(() => {
            this.attachInputEventListener();
            const searchInput = this.searchInput();
            if (searchInput && searchInput.nativeElement) {
                searchInput.nativeElement.value = '';
                searchInput.nativeElement.dispatchEvent(new Event('input'));
            }
        }, 0);
    }

    /**
     * Attaches an event listener to the input field for handling input events.
     */
    private attachInputEventListener(): void {
        const searchInput = this.searchInput();
        if (searchInput && searchInput.nativeElement && !searchInput.nativeElement.hasAttribute('listenerAttached')) {
            searchInput.nativeElement.addEventListener('input', (event: any) => {
                this.searchInputChanges$.next(event.target.value);
            });
            searchInput.nativeElement.setAttribute('listenerAttached', 'true'); // Mark listener as attached
        }
    }

    /**
     * Handles the search logic for filtering the autocomplete suggestions.
     * @param searchText The text to search for.
     */
    public handleSearch(searchText: string): void {
        this.searchSubject.next(searchText);
    }

    /**
     * Toggles the visibility of the dropdown.
     */
    public toggleDropdown(): void {
        const dropdownElement = this.dropdownWrapper()?.nativeElement;
        if (dropdownElement) {
            dropdownElement.classList.toggle('active', this.isActive);
            dropdownElement.classList.toggle('inactive', !this.isActive);
        }
    }

    /**
     * Sanitizes the SVG content for the left and right icons to prevent XSS attacks.
     */
    private sanitizeSvgIcons(): void {
        const leftIconSvg = this.leftIconSvg();
        const rightIconSvg = this.rightIconSvg();

        if (leftIconSvg) {
            this.sanitizedLeftIconSvg = this.sanitizer.bypassSecurityTrustHtml(leftIconSvg);
        }
        if (rightIconSvg) {
            this.sanitizedRightIconSvg = this.sanitizer.bypassSecurityTrustHtml(rightIconSvg);
        }
    }

    /**
     * Generates class names based on the input size.
     * Constructs an object suitable for ngClass based on `inputSize`.
     * @returns {Object} Object with dynamic class names
     */
    public getClass(): object {
        return {
            [`input--${this.inputSize()}`]: this.inputSize(),
        };
    }
}

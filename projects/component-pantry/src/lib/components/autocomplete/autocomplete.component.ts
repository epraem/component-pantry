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
    @Input() for: string = 'for';
    @Input() label: string = 'Default Label';
    @Input() placeholder: string = 'Default Placeholder';
    @Input() inputSize: string = 'medium';
    @Input() title: string = 'Default Title';
    @Input() autocompleteData: any[] = [];

    filteredData: any[] = [];
    hasLabel: boolean = false;
    isActive: boolean = false;

    @ViewChild('dropdownWrapper', { static: true }) dropdownWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

    ngOnInit() {
        this.filteredData = this.autocompleteData;
        this.hasLabel = !!this.label.trim().length;
    }

    ngAfterViewInit() {
        this.searchInput.nativeElement.addEventListener('focus', () => {
            this.isActive = true;
            this.toggleDropdown();
        });

        this.searchInput.nativeElement.addEventListener('blur', () => {
            setTimeout(() => {
                this.isActive = false;
                this.toggleDropdown();
            }, 200);
        });
    }

    toggleDropdown() {
        const dropdownElement = this.dropdownWrapper.nativeElement;
        dropdownElement.classList.toggle('active', this.isActive);
        dropdownElement.classList.toggle('inactive', !this.isActive);
    }

    filterData(searchText: string) {
        this.filteredData = this.autocompleteData.filter(option =>
            option.name.toLowerCase().includes(searchText.toLowerCase())
        );
    }

    optionSelect(option: { id: string; name: string }) {
        const dropdownHeader = this.dropdownWrapper.nativeElement.querySelector('.dropdown--header span');
        if (dropdownHeader) {
            dropdownHeader.textContent = `${option.name} |  (ID : ${option.id} ~ for testing purposes only)`;
        }
        this.isActive = false;
        this.toggleDropdown();
    }

    getClass(): object {
        return {
            [`input--${this.inputSize}`]: this.inputSize,
        };
    }
}
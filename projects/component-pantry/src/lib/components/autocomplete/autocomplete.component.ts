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
    @Input() size: string = 'medium';
    @Input() title: string = 'Default Title';
    @Input() autocompleteData: any[] = [];
    filteredData: any[] = [];
    hasLabel: boolean = false;
    isActive: boolean = false;

    @ViewChild('dropdownWrapper', { static: true }) dropdownWrapper!: ElementRef<HTMLDivElement>;
    @ViewChild('dropdownToggle', { static: true }) dropdownToggle!: ElementRef<HTMLDivElement>;

    ngOnInit() {
        this.filteredData = this.autocompleteData;
        if (this.label.length) {
            this.hasLabel = true;
        }
    }

    ngAfterViewInit() {
        this.dropdownToggle.nativeElement.addEventListener('click', () => {
            this.isActive = !this.isActive;
            this.toggleDropdown();
        });
    }

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

    filterData(searchText: string) {
        this.filteredData = this.autocompleteData.filter((option: { name: string }) =>
            option.name.toLowerCase().includes(searchText.toLowerCase()),
        );
    }

    optionSelect(option: { id: string; name: string }) {
        const dropdownHeader = this.dropdownWrapper.nativeElement.querySelector('.dropdown--header span');
        if (dropdownHeader) {
            dropdownHeader.textContent = `${option.name} |  (ID : ${option.id} ~ for testing purposes only)`;
        }
        this.isActive = false;
        this.toggleDropdown();
        console.log('Selected ID:', option.id);
    }

    getClass() {
        const classes = {
            [`input--${this.size}`]: this.size,
        };
        return classes;
    }
}

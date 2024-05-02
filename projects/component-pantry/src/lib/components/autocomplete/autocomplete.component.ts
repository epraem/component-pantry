import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'nctv-autocomplete',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit {
    @Input() for: string = 'for';
    @Input() label: string = 'Default Label';
    @Input() placeholder: string = 'Default Placeholder';
    @Input() size: string = 'medium';
    @Input() title: string = 'Default Title';

    @Input() autocompleteData: any = [];
    filteredData: any[] = [];
    isActive: boolean = false;

    wrapper: any;
    selectBtn: any;

    ngOnInit() {
        this.wrapper = document.querySelector('.dropdown');
        this.selectBtn = this.wrapper?.querySelector('.dropdown--toggle');
        this.attachEventListener();
        this.filteredData = this.autocompleteData;
    }

    attachEventListener() {
        this.selectBtn?.addEventListener('click', () => {
            this.isActive = !this.isActive;
            this.selectButton();
        });
    }

    filterData(searchText: string) {
        this.filteredData = this.autocompleteData.filter((option: { name: string }) =>
            option.name.toLowerCase().includes(searchText.toLowerCase()),
        );
    }

    highlightText(text: string, search: string): string {
        const startIndex = text.toLowerCase().indexOf(search.toLowerCase());
        if (startIndex === -1) {
            return text;
        }

        const endIndex = startIndex + search.length;
        const highlightedText =
            text.substring(0, startIndex) +
            '<mark>' +
            text.substring(startIndex, endIndex) +
            '</mark>' +
            text.substring(endIndex);

        return highlightedText;
    }

    selectButton() {
        if (!this.isActive) {
            this.wrapper?.classList.add('inactive');
            this.wrapper?.classList.remove('active');
        } else {
            this.wrapper?.classList.remove('inactive');
            this.wrapper?.classList.add('active');
        }
    }

    updateName(name: any) {
        console.log(name.innerText);
    }

    optionSelect(option: { id: string; name: string }) {
        const dropdownHeader = this.wrapper?.querySelector('.dropdown--header span');
        if (dropdownHeader) {
            dropdownHeader.textContent = option.name;
        }
        this.isActive = false;
        this.selectButton();
        console.log('Selected ID:', option.id);
    }

    getClass() {
        const classes = {
            [`input--${this.size}`]: this.size,
        };

        return classes;
    }
}

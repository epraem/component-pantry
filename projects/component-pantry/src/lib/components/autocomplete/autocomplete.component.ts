import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

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
  selectedOption: any;
  filteredData: any[] = [];
  hasLabel: boolean = false;
  isActive: boolean = false;
  searchSubject = new Subject<string>();

  @ViewChild('dropdownWrapper', { static: true }) dropdownWrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('searchInput', { static: true }) searchInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    this.filteredData = this.autocompleteData;
    this.hasLabel = !!this.label.trim().length;

    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe((searchText) => {
        this.filteredData = this.autocompleteData.filter((option) =>
          option.name.toLowerCase().includes(searchText.toLowerCase())
        );
      });
  }

  optionSelect(option: any) {
    this.selectedOption = option;
    this.searchInput.nativeElement.value = option.name;
    console.log('Selected option:', this.selectedOption);
    this.isActive = false;
    this.toggleDropdown();
    this.filteredData = this.autocompleteData;
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
        distinctUntilChanged()
      )
      .subscribe((searchText) => {
        this.handleSearch(searchText);
      });
  }

  handleSearch(searchText: string) {
    this.searchSubject.next(searchText);
  }

  handleBlur() {
    setTimeout(() => {
      this.isActive = false;
      this.toggleDropdown();
    }, 200);
  }

  toggleDropdown() {
    const dropdownElement = this.dropdownWrapper.nativeElement;
    dropdownElement.classList.toggle('active', this.isActive);
    dropdownElement.classList.toggle('inactive', !this.isActive);
  }

  getClass(): object {
    return {
      [`input--${this.inputSize}`]: this.inputSize,
    };
  }
}
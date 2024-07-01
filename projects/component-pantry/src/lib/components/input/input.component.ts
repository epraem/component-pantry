import { CommonModule } from '@angular/common';
import { Component, InputSignal, OnInit } from '@angular/core';
import { input } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'nctv-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
    /**
     * Identifier for the input element.
     */
    for = input<string>('');

    /**
     * Text label for the input.
     */
    label = input<string>('');

    /**
     * Placeholder text for the input.
     */
    placeholder = input<string>('');

    /**
     * Size of the input element (e.g., small, medium, large).
     */
    inputSize = input<string>('medium');

    /**
     * Input type (e.g., text, password, email).
     */
    inputType = input<string>('text');

    /**
     * Indicates whether the input is required.
     */
    required = input<boolean>(false);

    /**
     * Form control for managing the input value and its validation.
     * @type {InputSignal<FormControl>}
     */
    control: InputSignal<FormControl> = input<FormControl>(new FormControl(''));

    /**
     * Label to display when the input is invalid.
     */
    invalidLabel = input<string>('This field is required*');

    /**
     * Indicates whether the invalid label should be shown.
     */
    showInvalidLabel = input<boolean>(true);

    ngOnInit(): void {
        this.updateValidators();
    }

    private updateValidators(): void {
        if (this.required()) {
            this.control().setValidators([Validators.required]);
        } else {
            this.control().clearValidators();
        }
        this.control().updateValueAndValidity();
    }

    /**
     * Dynamically generates class names based on inputSize.
     * @returns {Object} Object with dynamic class names.
     */
    public getClass(): object {
        return {
            [`input--${this.inputSize()}`]: this.inputSize(),
        };
    }

    /**
     * Checks if the input is invalid.
     * @returns {boolean} True if the input is invalid, otherwise false.
     */
    public isInvalid(): boolean {
        return this.control().invalid && this.control().touched;
    }
}

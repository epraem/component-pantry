import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'nctv-input',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent {
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
    inputType = input<string>('text'); // Add input type signal here

    /**
     * Indicates whether the input is currently active (focused).
     */
    isActive: boolean = false;

    control = input<FormControl>(new FormControl());

    /**
     * Dynamically generates class names based on inputSize.
     * @returns {Object} Object with dynamic class names.
     */
    public getClass(): object {
        return {
            [`input--${this.inputSize()}`]: this.inputSize(),
        };
    }
}

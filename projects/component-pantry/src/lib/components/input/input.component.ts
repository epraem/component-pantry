import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { input } from '@angular/core';

@Component({
    selector: 'nctv-input',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent {
    /**
     * Identifier for the input element.
     */
    for = input<string>('for');

    /**
     * Text label for the input.
     */
    label = input<string>('Default Label');

    /**
     * Placeholder text for the input.
     */
    placeholder = input<string>('Default Placeholder');

    /**
     * Size of the input element (e.g., small, medium, large).
     */
    inputSize = input<string>('medium');

    /**
     * Indicates whether the input is currently active (focused).
     */
    isActive: boolean = false;

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

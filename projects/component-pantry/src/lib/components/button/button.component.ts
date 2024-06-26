import { Component } from '@angular/core';
import { ButtonSizes, ButtonTypes, ButtonActionTypes } from './button';
import { CommonModule } from '@angular/common';
import { input } from '@angular/core';

@Component({
    selector: 'nctv-button',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
    /**
     * The background color of the button. Accepts any valid CSS color value.
     * Used to force set the background color. Note: This does not influence hover and active states unless explicitly configured.
     */
    backgroundColor = input<string>('');

    /**
     * Disabled state. Accepts true or false value.
     */
    disabled = input<boolean>(false);

    /**
     * The icon to display on the left side of the label. Expected to be a valid icon reference.
     */
    iconLeft = input<string>('');

    /**
     * The icon to display on the right side of the label. Expected to be a valid icon reference.
     */
    iconRight = input<string>('');

    /**
     * The text to display on the button. This label can be anything from a simple string to complex HTML.
     */
    label = input<string>('Click Me');

    /**
     * Defines the size of the button. Accepted values are 'sm', 'normal', 'lg'.
     */
    size = input<ButtonSizes>('normal');

    /**
     * The text color of the button. Accepts any valid CSS color value.
     * Used to force set the text color. Note: This does not influence hover and active states unless explicitly configured.
     */
    textColor = input<string>('');

    /**
     * Defines the type of the button, which influences its styling. Valid types are 'danger', 'primary', 'secondary', 'success', 'warning'.
     */
    buttonStyle = input<ButtonTypes>('primary');

    /**
     * Defines the type of the button element. Valid types are 'button', 'submit', 'reset'.
     */
    buttonActionType = input<ButtonActionTypes>('button');

    /**
     * Generates class names based on button style and size, if values are provided.
     * Constructs an object suitable for ngClass based on `buttonStyle` and `size`.
     * @returns {Object} Object with dynamic class names
     */
    public getClass() {
        return {
            [`btn--${this.buttonStyle()}`]: this.buttonStyle(),
            [`btn--${this.size()}`]: this.size(),
        };
    }
}

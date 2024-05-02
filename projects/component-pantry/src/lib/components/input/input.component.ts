import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'nctv-input',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
    @Input() for: string = 'for';
    @Input() label: string = 'Default Label';
    @Input() placeholder: string = 'Default Placeholder';
    @Input() size: string = 'medium';

    isActive: boolean = false;

    wrapper: any;
    selectBtn: any;

    ngOnInit() {}

    getClass() {
        const classes = {
            [`input--${this.size}`]: this.size,
        };

        return classes;
    }
}

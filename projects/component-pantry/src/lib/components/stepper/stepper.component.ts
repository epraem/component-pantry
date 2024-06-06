import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';

@Component({
    selector: 'nctv-stepper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
    constructor(private _ngZone: NgZone) {}

    /**
     * Determines if the steps are clickable, allowing users to navigate directly to a specific step.
     */
    @Input() clickable: boolean = true;

    /**
     * Index of the current active step.
     */
    @Input() currentStep: number = 0; // Ensure default is a valid index

    /**
     * Orientation of the stepper. Can be 'vertical' or 'horizontal'.
     */
    @Input() orientation: string = 'vertical';

    /**
     * Flag indicating whether to display the steps in the stepper.
     */
    @Input() showSteps: boolean = true;

    /**
     * Array of steps to be displayed in the stepper.
     * Each step should be an object with 'label' and 'completed' properties.
     */
    @Input() steps: { label: string; completed: boolean }[] = [];

    /**
     * Event emitter triggered when the stepper has finished all steps.
     */
    @Output() finished = new EventEmitter<void>();

    /**
     * Moves to the next step in the stepper.
     * @returns void
     */
    public onNext(): void {
        this._ngZone.run(() => {
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep += 1;
            }
        });
    }

    /**
     * Moves to the previous step in the stepper.
     * @returns void
     */
    public onBack(): void {
        this._ngZone.run(() => {
            if (this.currentStep > 0) {
                this.currentStep -= 1;
            }
        });
    }

    /**
     * Navigates directly to the specified step index.
     * @param index Index of the step to navigate to.
     * @returns void
     */
    public goToStep(index: number): void {
        if (this.clickable) {
            this._ngZone.run(() => {
                this.currentStep = index;
            });
        }
    }

    /**
     * Emits the finished event, indicating that all steps are completed.
     * @returns void
     */
    public onFinish(): void {
        this._ngZone.run(() => {
            this.finished.emit();
        });
    }
}

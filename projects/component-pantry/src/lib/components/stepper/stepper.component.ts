import { CommonModule } from '@angular/common';
import { Component, input, effect, signal, output } from '@angular/core';

@Component({
    selector: 'nctv-stepper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
    /**
     * Determines if the steps are clickable, allowing users to navigate directly to a specific step.
     */
    clickable = input<boolean>(true);

    /**
     * Index of the current active step.
     */
    currentStep = input<number>(0); // Ensure default is a valid index
    public internalCurrentStep = signal(this.currentStep());

    /**
     * Orientation of the stepper. Can be 'vertical' or 'horizontal'.
     */
    orientation = input<string>('vertical');

    /**
     * Flag indicating whether to display the steps in the stepper.
     */
    showSteps = input<boolean>(true);

    /**
     * Array of steps to be displayed in the stepper.
     * Each step should be an object with 'label' and 'completed' properties.
     */
    steps = input<{ label: string; completed: boolean }[]>([]);

    /**
     * Event emitter triggered when the stepper has finished all steps.
     */
    finished = output<void>();

    constructor() {
        effect(
            () => {
                this.internalCurrentStep.set(this.currentStep());
            },
            { allowSignalWrites: true },
        );

        effect(
            () => {
                if (this.internalCurrentStep() >= this.steps().length) {
                    this.internalCurrentStep.set(this.steps().length - 1);
                } else if (this.internalCurrentStep() < 0) {
                    this.internalCurrentStep.set(0);
                }
            },
            { allowSignalWrites: true },
        );
    }

    /**
     * Moves to the next step in the stepper.
     * @returns void
     */
    public onNext(): void {
        if (this.internalCurrentStep() < this.steps().length - 1) {
            this.internalCurrentStep.set(this.internalCurrentStep() + 1);
        }
    }

    /**
     * Moves to the previous step in the stepper.
     * @returns void
     */
    public onBack(): void {
        if (this.internalCurrentStep() > 0) {
            this.internalCurrentStep.set(this.internalCurrentStep() - 1);
        }
    }

    /**
     * Navigates directly to the specified step index.
     * @param index Index of the step to navigate to.
     * @returns void
     */
    public goToStep(index: number): void {
        if (this.clickable() && index >= 0 && index < this.steps().length) {
            this.internalCurrentStep.set(index);
        }
    }

    /**
     * Emits the finished event, indicating that all steps are completed.
     * @returns void
     */
    public onFinish(): void {
        this.finished.emit();
    }
}

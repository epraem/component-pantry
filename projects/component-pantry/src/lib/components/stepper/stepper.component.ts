import { CommonModule } from '@angular/common';
import { Component, Input, input, output } from '@angular/core';

@Component({
    selector: 'nctv-stepper',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './stepper.component.html',
    styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent {
    steps = input<{label: string, completed: boolean}[]>([
        { label: 'Step 1', completed: true },
        { label: 'Step 2', completed: true },
        { label: 'Step 3', completed: true },
        { label: 'Step 4', completed: true },
    ]);

    @Input() currentStep = 0;
    orientation = input('vertical');
    showSteps = input(false);
    clickable = input(true);

    changeStep = output<number>();

    onNext() {
        if (this.currentStep < this.steps().length - 1) {
            this.changeStep.emit(this.currentStep + 1);
        }
    }

    onBack() {
        if (this.currentStep > 0) {
            this.changeStep.emit(this.currentStep - 1);
        }
    }

    goToStep(index: number) {
        if (this.clickable()) {
            this.changeStep.emit(index);
            console.log(index, this.clickable(), this.changeStep.emit(index))
        }
    }

    onFinish() {
        this.changeStep.emit(this.steps().length);
    }
}

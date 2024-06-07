import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent, CardComponent, TextComponent } from '@ncompasstv/component-pantry';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ButtonComponent, CardComponent, TextComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'sandbox-app';
}

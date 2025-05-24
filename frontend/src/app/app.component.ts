import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector.component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MoodSelectorComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}

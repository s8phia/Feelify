import { Component, Inject } from '@angular/core';
import { SongService } from '../../song.service'; // Adjusted the path to the correct relative location

@Component({
  selector: 'app-mood-selector',
  imports: [],
  templateUrl: './mood-selector.component.html',
  styleUrl: './mood-selector.component.scss'
})
export class MoodSelectorComponent {
  moods = ['happy', 'sad', 'angry', 'chill', 'excited', 'romantic'];
  selectedMood: string = '';
  songs: string[] = [];

  constructor(private songService: SongService) {}

  selectMood(mood: string) {
    this.selectedMood = mood;
    this.songService.getSongsByMood(mood).subscribe((data) => {
      this.songs = data;
    });
  }
}


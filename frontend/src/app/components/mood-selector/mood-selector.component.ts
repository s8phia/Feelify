import { Component, Inject } from '@angular/core';
import { SongService } from '../../song.service'; 
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
    console.log('Selected mood:', mood);
    this.selectedMood = mood;
    this.songService.getSongsByMood(mood).subscribe({
      next: (data) => {
        console.log('Received songs:', data);
        this.songs = data;
      },
    
    });
  }
}


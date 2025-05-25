import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SongService } from '../../song.service'; 
import { Song } from '../../model/song.model'; 
import { fromReadableStreamLike } from 'rxjs/internal/observable/innerFrom';

@Component({
  selector: 'app-mood-selector',
  imports: [CommonModule],
  templateUrl: './mood-selector.component.html',
  styleUrl: './mood-selector.component.scss'
})
export class MoodSelectorComponent {
  moods = ['happy', 'sad', 'angry', 'chill', 'excited', 'romantic'];
  selectedMood: string = '';
  songs: Song[] = [];
  isLoading: boolean = false;

  constructor(private songService: SongService) {}

  selectMood(mood: string) {
    console.log('Selected mood:', mood);
    this.selectedMood = mood;
    this.isLoading = true;
    this.songs =[];
    this.songService.getSongsByMood(mood).subscribe({
      next: (data) => {
        console.log('Received songs:', data);
        this.songs = data.songs;
        this.isLoading = false;
        
      },
      error: (error) => {
        console.error('Error fetching songs:', error);
        this.isLoading = false;
        alert('Failed to fetch songs.');
      },
    });
  }
}


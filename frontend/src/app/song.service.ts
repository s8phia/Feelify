import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Song } from './model/song.model'; 


@Injectable({ providedIn: 'root' })
export class SongService {

  constructor(private http: HttpClient) { //http: HttpClient is a parameter, private automically creates a class property (this.http)
    
  }

  getSongsByMood(mood: string): Observable<{ songs: Song[] }> {
    return this.http.post<{ songs: Song[] }>('http://localhost:3000/api/recommend', { mood });
  }
  
}

// for instance whatever the user clicks, mood: happy, we'll use that data
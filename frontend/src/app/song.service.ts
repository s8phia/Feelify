import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SongService {

  constructor(private http: HttpClient) { //http: HttpClient is a parameter, private automically creates a class property (this.http)
    
  }

  getSongsByMood(mood: string): Observable<any[]> { //Observable is a type of data stream, any[] is the type of data we expect to receive
    return this.http.post<any[]>('http://localhost:3000/api/recommend', { mood: mood}); //mood is the payload or information we want the server to use
  }
}

// for instance whatever the user clicks, mood: happy, we'll use that data
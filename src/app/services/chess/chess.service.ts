import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessService {
  private API_URL = 'https://lichess.org/api/puzzle/daily';

  constructor(private http: HttpClient) {}

  getDailyPuzzle(): Observable<any> {
    const response = this.http.get<any>(this.API_URL);
    console.log(response);
    return response;
  }
}

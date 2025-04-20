import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SentimentResponse {
  prediction: boolean;
  probability: number;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class SentimentService {
  private apiUrl = 'http://localhost:5027/predict';

  constructor(private http: HttpClient) { }

  predictSentiment(text: string): Observable<SentimentResponse> {
    return this.http.post<SentimentResponse>(this.apiUrl, { text });
  }

  isPositiveSentiment(response: SentimentResponse): boolean {
    return response.prediction && response.probability >= 0.5;
  }
}

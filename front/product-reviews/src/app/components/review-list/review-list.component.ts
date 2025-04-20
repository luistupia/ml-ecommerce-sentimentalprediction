import { Component, OnInit, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../interfaces/review.interface';
import { SentimentResponse } from '../../services/sentiment.service';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-list.component.html',
  styleUrls: ['./review-list.component.scss']
})
export class ReviewListComponent implements OnInit {
  @Input() set productId(value: number) {
    this._productId.set(value);
    this.loadReviews();
  }
  get productId() {
    return this._productId();
  }

  private _productId = signal<number>(0);
  reviews = signal<Review[]>([]);
  sentiments = signal<Map<number, SentimentResponse>>(new Map());

  constructor(private reviewService: ReviewService) { }

  ngOnInit(): void {
    this.loadReviews();
  }

  private loadReviews(): void {
    if (this._productId()) {
      this.reviewService.getReviewsByProductId(this._productId()).subscribe(
        reviews => {
          this.reviews.set(reviews);
          reviews.forEach(review => {
            this.reviewService.analyzeSentiment(review.comment).subscribe(
              sentiment => {
                const currentSentiments = this.sentiments();
                currentSentiments.set(review.id, sentiment);
                this.sentiments.set(currentSentiments);
              }
            );
          });
        }
      );
    }
  }

  getSentiment(reviewId: number): SentimentResponse | undefined {
    return this.sentiments().get(reviewId);
  }

  isPositiveSentiment(sentiment: SentimentResponse | undefined): boolean {
    if (!sentiment) return false;
    return this.reviewService.isPositiveSentiment(sentiment);
  }
}

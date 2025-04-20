import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { Review } from '../interfaces/review.interface';
import { SentimentService, SentimentResponse } from './sentiment.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviews: Review[] = [
    {
      id: 1,
      productId: 1,
      userName: 'Juan Pérez',
      rating: 5,
      comment: 'Excelente producto, la cámara es increíble y el rendimiento es excepcional. La batería dura todo el día con uso intensivo.',
      date: new Date('2024-03-15')
    },
    {
      id: 2,
      productId: 1,
      userName: 'María García',
      rating: 2,
      comment: 'El precio es demasiado alto para lo que ofrece. La cámara es buena pero no justifica el costo. Además, el cargador se calienta demasiado.',
      date: new Date('2024-03-14')
    },
    {
      id: 3,
      productId: 1,
      userName: 'Carlos López',
      rating: 4,
      comment: 'Buen teléfono en general, pero tiene algunos problemas con el reconocimiento facial en condiciones de poca luz.',
      date: new Date('2024-03-13')
    },
    {
      id: 4,
      productId: 2,
      userName: 'Ana Martínez',
      rating: 5,
      comment: 'La mejor laptop que he tenido. El chip M2 es increíblemente rápido y la pantalla es espectacular. Perfecta para trabajo y entretenimiento.',
      date: new Date('2024-03-12')
    },
    {
      id: 5,
      productId: 2,
      userName: 'Roberto Sánchez',
      rating: 3,
      comment: 'Buena laptop pero el precio es excesivo. Además, la falta de puertos USB es un problema real para mi trabajo diario.',
      date: new Date('2024-03-11')
    },
    {
      id: 6,
      productId: 2,
      userName: 'Laura Torres',
      rating: 4,
      comment: 'Excelente rendimiento y diseño, pero el teclado se ensucia fácilmente y es difícil de limpiar.',
      date: new Date('2024-03-10')
    },
    {
      id: 7,
      productId: 3,
      userName: 'Pedro Ramírez',
      rating: 5,
      comment: 'Los AirPods Pro son geniales, la cancelación de ruido funciona perfectamente y la calidad de sonido es excelente. Los uso todo el día.',
      date: new Date('2024-03-09')
    },
    {
      id: 8,
      productId: 3,
      userName: 'Sofía Castro',
      rating: 2,
      comment: 'No valen el precio. La cancelación de ruido es mediocre y la batería dura menos de lo anunciado. Me arrepiento de la compra.',
      date: new Date('2024-03-08')
    },
    {
      id: 9,
      productId: 3,
      userName: 'Miguel Ángel',
      rating: 4,
      comment: 'Buenos auriculares en general, pero el caso de carga se raya fácilmente y el precio es alto para lo que ofrecen.',
      date: new Date('2024-03-07')
    }
  ];

  constructor(private sentimentService: SentimentService) { }

  getReviewsByProductId(productId: number): Observable<Review[]> {
    return of(this.reviews.filter(review => review.productId === productId));
  }

  analyzeSentiment(text: string): Observable<SentimentResponse> {
    return this.sentimentService.predictSentiment(text);
  }

  isPositiveSentiment(response: SentimentResponse): boolean {
    return this.sentimentService.isPositiveSentiment(response);
  }
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../interfaces/product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'iPhone 14 Pro',
      description: 'El último iPhone con cámara profesional y chip A16 Bionic',
      price: 999.99,
      imageUrl: 'bi-phone',
      category: 'Smartphones',
      rating: 4.5
    },
    {
      id: 2,
      name: 'MacBook Pro M2',
      description: 'Potencia profesional con chip M2 y pantalla Liquid Retina XDR',
      price: 1299.99,
      imageUrl: 'bi-laptop',
      category: 'Laptops',
      rating: 4.8
    },
    {
      id: 3,
      name: 'AirPods Pro',
      description: 'Auriculares inalámbricos con cancelación activa de ruido',
      price: 249.99,
      imageUrl: 'bi-headphones',
      category: 'Audio',
      rating: 4.6
    }
  ];

  constructor() { }

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.products.find(product => product.id === id));
  }
}

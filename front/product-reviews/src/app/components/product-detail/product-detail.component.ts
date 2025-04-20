import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.interface';
import { ReviewListComponent } from '../review-list/review-list.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, ReviewListComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product = signal<Product | undefined>(undefined);
  productId = signal<number>(0);

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.productId.set(id);
      this.productService.getProductById(id).subscribe(
        product => this.product.set(product)
      );
    });
  }
}

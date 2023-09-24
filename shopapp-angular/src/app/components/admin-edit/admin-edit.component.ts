import { Component } from '@angular/core';
import { Product } from 'src/app/model/product';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent {
  product!: Product; // Initialize an empty product object

  constructor(private productService: ProductService) {}

  saveProduct() {
    // // Call your product service to save the product
    // this.productService.saveProduct(this.product).subscribe(
    //   () => {
    //     // Product saved successfully
    //     // You can show a success message or redirect to another page
    //   },
    //   (error) => {
    //     // Handle the error
    //     // You can show an error message or log the error
    //   }
    // );
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      // Perform image upload logic here
      // You can use a separate service or library to handle the image upload
    }
  }
}

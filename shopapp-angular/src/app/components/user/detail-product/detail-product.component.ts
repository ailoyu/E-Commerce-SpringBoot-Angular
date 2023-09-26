import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/model/product';
import { ProductImage } from 'src/app/model/product.image';
import { CartService } from 'src/app/service/cart.service';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})
export class DetailProductComponent implements OnInit{
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;

  constructor(
    private productService :ProductService,
    private cartService :CartService,
    // private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
  ){}

  ngOnInit() {
      // Lấy productId từ URL

      debugger
      this.route.paramMap.subscribe(params => {
        const idParam = params.get('id');
        // Sử dụng giá trị của tham số ở đây

        if(idParam !== null){
          this.productId = +idParam;
        }
        if(!isNaN(this.productId)){
          this.productService.getDetailProduct(this.productId).subscribe({
            next: (response : any) => {
              // Lấy danh sách sản phẩm và thay đổi URL
              debugger
              // if(response.product_images && response.product_images.length > 0){
                response.product_images.forEach((product_image: ProductImage) => {
                  product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
                });
              // }
              debugger
              this.product = response
              // Bắt đầu với ảnh đầu tiên
              this.showImage(0);
            },
            complete: () => {
              debugger;
            },
            error: (error: any) => {
              debugger
              console.error('Lỗi bắt dữ liệu detail product', error);
            }
          });
        } else {
          console.error('Invalid productId', idParam);
        }
      });
      
  }

  showImage(index: number): void {
    debugger
    if(this.product && this.product.product_images && this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if(index < 0) {
        index = 0;
      } else if(index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number){
    debugger
    // Gọi khi 1 thumbnail dc ấn
    this.currentImageIndex = index; // cập nhật currentImageIndex
  }

  nextImage(){
    debugger
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage() : void {
    debugger
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    debugger
    if(this.product){
      this.cartService.addToCart(this.productId, this.quantity);
      alert("Đã thêm " + this.quantity + " sản phẩm này vào giỏ hàng thành công!");
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null');
      alert('Không thể thêm sản phẩm vào giỏ hàng vì product là null');
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if(this.quantity > 1){
      this.quantity--;
    }
  }

  buyNow(): void {
    // Thực hiện xử lý khi người dùng muốn mua ngay
    if(this.product){
      this.cartService.addToCart(this.productId, this.quantity);
      this.router.navigate(['/order']);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null');
      alert('Không thể thêm sản phẩm vào giỏ hàng vì product là null');
    }
  }
  
}

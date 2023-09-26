import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItemDTO } from 'src/app/dtos/order/cart.item.dto';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { environment } from 'src/app/environments/environment';
import { Product } from 'src/app/model/product';
import { CartService } from 'src/app/service/cart.service';
import { OrderService } from 'src/app/service/order.service';
import { ProductService } from 'src/app/service/product.service';
import { UserService } from 'src/app/service/user.service';
import { validate, ValidationError } from 'class-validator';
import { TokenService } from 'src/app/service/token.service';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit{

  orderForm: FormGroup; //Dùng orderForm để validate dữ liệu nhập
  


  cartItems: { product: Product, quantity: number }[] = [];
  couponCode: string = ''; // Mã giảm giá
  totalAmount: number = 0; // Tổng tiền

  orderData: OrderDTO = {
    user_id: 1, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: '', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: '', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []

  };

  
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private cartService: CartService,
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder
  ){
    this.orderForm = this.fb.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      shipping_method: [''],
      payment_method: ['']
    });
  }

    loginResponse$!: Observable<LoginResponse> | null;
  loginResponse!: LoginResponse | null;



  ngOnInit(): void {
    // Lấy danh sách sản phẩm từ giỏ hàng hiện tại
  
    
    
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys()); // lấy id sản phẩm trong giỏ hàng (Map)

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {            
        debugger
        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
          }          
          return {
            product: product!,
            quantity: cart.get(productId)!
          };
        });
        console.log('haha');
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
      }
    });        
  }


  

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
    );
}

  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
      // Viết mã xử lý áp dụng mã giảm giá ở đây
      // Cập nhật giá trị totalAmount dựa trên mã giảm giá nếu áp dụng
  }

  user_id!: number;
  
  isLoading = false;

  

  placeOrder() {
    this.isLoading = true;
    
    debugger
    this.loginResponse$ = this.tokenService.displayUserInformation();

    this.loginResponse$
  ? this.loginResponse$.subscribe(response => this.mappingFormDataUser(response?.id ?? 1))
  : this.mappingFormDataUser(1);
    
    // if (this.loginResponse$) {
    //   this.loginResponse$?.subscribe(response => {this.mappingFormDataUser(response?.id ?? 1);});
    // } else {
    //   this.mappingFormDataUser(1);
    // }

    
    
  }  

  mappingFormDataUser(user_id: number) {
    // Map dữ liệu từ orderForm -> orderData
    this.orderData.user_id = user_id;
    this.orderData = {
      ...this.orderData,
      ...this.orderForm.value
    };
    this.orderData.cart_items = this.cartItems.map(cartItem => ({
      product_id: cartItem.product.id,
      quantity: cartItem.quantity
    }));
    this.orderData.total_money = this.totalAmount;
    this.orderService.placeOrder(this.orderData).subscribe({
      next: (response) => {            
        debugger   
        // this.cartService.clearCart();    
        alert('Đặt hàng thành công');
        this.router.navigate(['/order-detail']); 
        console.log('Đặt hàng thành công');
      },
      complete: () => {
        debugger;
        this.calculateTotal()
      },
      error: (error: any) => {
        debugger;
        alert('Đặt hàng thất bại '+ error.error);             
        console.error('Lỗi khi đặt hàng:', error);
        this.isLoading = false;
      }
    });      
  }


  onProductClick(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/detail-product', productId]);
  }

  removeAllCart(){
    this.cartService.clearCart();
    // this.router.navigate(['/order']);
    location.reload();

  }


}

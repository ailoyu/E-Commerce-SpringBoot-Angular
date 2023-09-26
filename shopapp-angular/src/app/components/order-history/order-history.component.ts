import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CartItemDTO } from 'src/app/dtos/order/cart.item.dto';
import { OrderDTO } from 'src/app/dtos/order/order.dto';
import { environment } from 'src/app/environments/environment';
import { LoginResponse } from 'src/app/responses/user/login.response';
import { OrderService } from 'src/app/service/order.service';
import { TokenService } from 'src/app/service/token.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit{

  constructor(private tokenService: TokenService,
    private orderService: OrderService,
    private datePipe: DatePipe,
    private router: Router){}

  cart_items!: CartItemDTO[]; // Thêm cart_items để lưu thông tin giỏ hàng
  

  phoneNumber!: string;
  loginResponse$!: Observable<LoginResponse> | null;
  loginResponse!: LoginResponse | null;
  getOrder: any[] = [];

  selectedOrder: number | null = null;

    toggleBodyAndFooter(orderId: number) {
        if (this.selectedOrder === orderId) {
            this.selectedOrder = null;
        } else {
            this.selectedOrder = orderId;
        }
    }


  ngOnInit(): void {
    // Lấy sdt từ token ra -> gọi api getOrderByPhoneNumber (lịch sử đơn hàng)
    this.loginResponse$ = this.tokenService.displayUserInformation();
  
    this.loginResponse$?.subscribe(response => {
      this.loginResponse = { ...response };
  
      this.orderService.getOrderByUserId(this.loginResponse?.id)?.subscribe((orders: any[]) => {
          // this.getOrder = orders;
          // console.log(this.getOrder);
          this.getOrder = orders.map(order => ({
            ...order,
            orderDate: this.parseDate(order.orderDate),
            shippingDate: this.parseDate(order.shippingDate)
          }));
          debugger
          console.log(this.getOrder);
        });
    });
  }

  parseDate(date: number): string {
    const parsedDate = new Date(date);

    const formattedDate = this.datePipe.transform(parsedDate, 'HH:mm:ss') === '00:00:00' ?
    this.datePipe.transform(parsedDate, 'dd-MM-YYYY') :
    this.datePipe.transform(parsedDate, 'dd-MM-YYYY HH:mm:ss');

return formattedDate || '';
  }
  
  parseThumbnail(thumbnail: string): string{
    debugger
    thumbnail =  `${environment.apiBaseUrl}/products/images/` + thumbnail;
    return thumbnail;
  }

  onProductClick(productId: number) {
    debugger
    // Điều hướng đến trang detail-product với productId là tham số
    this.router.navigate(['/detail-product', productId]);
  }

}

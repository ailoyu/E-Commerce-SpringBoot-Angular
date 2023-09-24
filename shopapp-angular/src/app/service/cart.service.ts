import { Injectable } from "@angular/core";
import { ProductService } from "./product.service";
import { environment } from "../environments/environment";
import { Product } from "../model/product";


@Injectable({
    providedIn: 'root'
})
export class CartService {

    private cart: Map<number, number> = new Map(); // Dùng Map để lưu trữ giỏ hàng
                                                 // key là id sản phẩm, value là số lượng

    constructor(private productService: ProductService) {
        // Lấy dữ liệu giỏ hàng từ localStorage khi khởi tạo service
        const storedCart = localStorage.getItem('cart');
        if(storedCart) { // nếu có dữ liệu trong localStorage (giỏ hàng)
            this.cart = new Map (JSON.parse(storedCart));
        }
    }

    addToCart(productId: number, quantity: number = 1): void {
        debugger
        if(this.cart.has(productId)){ // nếu có sp này trong giỏ hàng, thì tăng quantity hiện tại
            this.cart.set(productId, this.cart.get(productId)! +quantity);
        } else { // nếu sp ko có trong giỏ hàng, thì thêm sp với số lượng là quantity
            this.cart.set(productId, quantity);
        }

        // Sau khi thay đổi giỏ hàng xong, lưu vào localStorage
        this.saveCartLocalStorage();
    }

    getCart(): Map<number, number> {
        return this.cart;
    }

    // lưu giỏ hàng vào localStorage
    private saveCartLocalStorage(): void {
        debugger
        localStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }

    // xóa giỏ hàng và cập nhật localStorage
    clearCart(): void {
        this.cart.clear(); // Xóa toàn bộ dữ liệu trong giỏ hàng
        this.saveCartLocalStorage(); // lưu giỏ hàng rỗng mới xóa vào LocalStorage lại
    }


}
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/app/environments/environment';
import { Category } from 'src/app/model/category';
import { Product } from 'src/app/model/product';
import { ProductImage } from 'src/app/model/product.image';
import { CategoryService } from 'src/app/service/category.service';
import { ProductService } from 'src/app/service/product.service';

@Component({
  selector: 'app-admin-edit',
  templateUrl: './admin-edit.component.html',
  styleUrls: ['./admin-edit.component.scss']
})
export class AdminEditComponent implements OnInit {
  product!: Product; // Initialize an empty product object

  productForm: FormGroup; //Dùng orderForm để validate dữ liệu nhập

  categories: Category[] = [];
  

  images: { file: File, base64: string }[] = [];

onFileChange(event: any) {
  const files: FileList = event.target.files;
  const newImages: { file: File, base64: string }[] = [];

  const readerPromises: Promise<any>[] = [];

  for (let i = 0; i < files.length; i++) {
    const reader = new FileReader();
    const file = files[i];

    reader.onload = (e: any) => {
      newImages.push({
        file: file,
        base64: e.target.result
      });
    };
    
    // tạo một mảng `readerPromises` để lưu trữ các promise của mỗi lần đọc file.
    const readerPromise = new Promise<void>((resolve) => {
      reader.onloadend = () => {
        resolve();
      };
    });
    
    // tất cả các file đã được đọc
    reader.readAsDataURL(file);
    readerPromises.push(readerPromise); // lưu trữ các promise của mỗi lần đọc file.
  }

  // gán giá trị mới cho biến `images`

  Promise.all(readerPromises).then(() => {
    this.images = [...this.images, ...newImages];
  });
}

deleteImage(image: { file: File, base64: string }) {
  // Lọc ra các ảnh khác ảnh cần xóa và gán lại giá trị cho biến `images`
  this.images = this.images.filter(img => img !== image);
}
  


  constructor(private productService: ProductService,
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router) {
    this.productForm = this.fb.group({
      name: ['', Validators.required], // fullname là FormControl bắt buộc      
      description: ['', [Validators.required]], // Sử dụng Validators.email cho kiểm tra định dạng email
      price: ['', [Validators.required]], // phone_number bắt buộc và ít nhất 6 ký tự
      category_id: ['', Validators.required]
    });
  }

  productId: number = 0;


  ngOnInit(): void {
    this.getCategories();
    this.route.paramMap.subscribe(params => {
      debugger
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
            console.log(this.product)

            // Bắt đầu với ảnh đầu tiên
            // this.showImage(0);
          },
          complete: () => {
            debugger;
            this.productForm = this.fb.group({
              name: [this.product.name, Validators.required], // fullname là FormControl bắt buộc      
              description: [this.product.description, [Validators.required]], // Sử dụng Validators.email cho kiểm tra định dạng email
              price: [this.product.price, [Validators.required]], // phone_number bắt buộc và ít nhất 6 ký tự
              category_id: [this.product.category_id, Validators.required]
            });
            debugger
              const newImages: { file: File, base64: string }[] = [];
            
              const readerPromises: Promise<any>[] = [];
            
              for (let i = 0; i < this.product.product_images.length; i++) {
                newImages.push({
                  file: new File([], ''),
                  base64: this.product.product_images[i].image_url
                });
              }
              debugger

              this.images = newImages;

            
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

  getCategories(){
    this.categoryService.getCategories().subscribe({
      next: (categories: Category[]) => {
        debugger 
        this.categories = categories;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error("Lỗi bắt dữ liệu thể loại", error);
      }
    });
  }


  isLoading = false;

  

  saveProduct() {

    this.isLoading = true;

    debugger
    this.product = {
      ...this.product,
      ...this.productForm.value
    };

    this.product.images = this.images.map(image => image.base64);

    console.log(this.product);

    // Call your product service to save the product
    this.productService.saveProduct(this.product)?.subscribe({
      next: (product) => {
        
        alert("Thêm sản phẩm thành công");
        this.router.navigate(['/admin/edit-products', product.id]);
        this.isLoading = false;
      },
      complete: () => {
      
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
        alert("Thêm sản phẩm thất bại");
        this.isLoading = false;
      }
    });
  }


  updateProduct() {
    this.isLoading = true;

    debugger
    this.product = {
      ...this.product,
      ...this.productForm.value
    };
    this.product.id = this.productId;

    this.product.images = this.images.map(image => image.base64);

    // Call your product service to save the product
    this.productService.updateProduct(this.product)?.subscribe({
      next: (product) => {
        
        alert("Cập nhật sản phẩm thành công");
        this.isLoading = false;
      },
      complete: () => {
      
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error);
        alert("Cập nhật sản phẩm thất bại");
        this.isLoading = false;
      }
    });

  }

  
}

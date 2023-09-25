import { ProductImage } from "./product.image";

export interface Product {
    id: number;
    name: string;
    price: number;
    thumbnail: string;
    images: string[];
    description: string;
    category_name: string;
    category_id: number;
    url: string;
    product_images: ProductImage[];
}
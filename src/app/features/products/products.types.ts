export interface Product {
  id: number;
  sku: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
  categoryName: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
}

export interface UpdateProductRequest {
  name: string;
  sku: string;
  description?: string | null;
  price: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
  isActive: boolean;
}

export interface ProductFormValue {
  name: string;
  sku: string;
  description: string | null;
  price: number;
  stock: number;
  minimumStock: number;
  categoryId: number;
  isActive: boolean;
}
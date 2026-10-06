export interface SaleItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  customerId: number;
  customerName: string;
  userId: number;
  userName: string;
  total: number;
  createdAt: string;
  items: SaleItem[];
}

export interface CreateSaleItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateSaleRequest {
  customerId: number;
  items: CreateSaleItemRequest[];
}

export interface SaleFormItem {
  productId: number;
  quantity: number;
}

export interface SaleFormValue {
  customerId: number;
  items: SaleFormItem[];
}
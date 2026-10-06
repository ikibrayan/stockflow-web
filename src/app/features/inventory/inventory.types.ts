export type InventoryMovementType = 'Entry' | 'Exit' | 'Adjustment';

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  userId: number;
  userName: string;
  type: InventoryMovementType;
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  createdAt: string;
}

export interface CreateInventoryEntryRequest {
  productId: number;
  quantity: number;
  reference: string;
}

export interface CreateInventoryAdjustmentRequest {
  productId: number;
  newStock: number;
  reference: string;
}

export interface InventoryEntryFormValue {
  productId: number;
  quantity: number;
  reference: string;
}

export interface InventoryAdjustmentFormValue {
  productId: number;
  newStock: number;
  reference: string;
}
export interface Category {
  id: number;
  name: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryRequest {
  name: string;
  description?: string | null;
  isActive: boolean;
}

export interface CategoryFormValue {
  name: string;
  description: string | null;
  isActive: boolean;
}
export interface Customer {
  id: number;
  name: string;
  document: string;
  email: string;
  phone: string;
  createdAt: string;
}

export interface CreateCustomerRequest {
  name: string;
  document: string;
  email: string;
  phone: string;
}

export interface UpdateCustomerRequest {
  name: string;
  document: string;
  email: string;
  phone: string;
}

export interface CustomerFormValue {
  name: string;
  document: string;
  email: string;
  phone: string;
}
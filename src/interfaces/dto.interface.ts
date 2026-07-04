import { PurchaseStatus } from '../enums/purchase-status.enum';

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface CreatePurchaseDetailDto {
  productId: string;
  quantity: number;
  unitCost: number;
}

export interface CreatePurchaseDto {
  supplierId: string;
  purchaseDate: string;
  observations?: string;
  details: CreatePurchaseDetailDto[];
}

export interface ChangePurchaseStatusDto {
  status: PurchaseStatus;
}
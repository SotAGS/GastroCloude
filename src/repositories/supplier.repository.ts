import { Supplier } from '../models';

export class SupplierRepository {
  async findActiveById(id: string): Promise<Supplier | null> {
    return Supplier.findOne({ where: { id, isActive: true } });
  }
}
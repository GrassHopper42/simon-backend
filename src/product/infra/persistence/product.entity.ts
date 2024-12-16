import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductStatus } from '../../domain/models/product.model';
import { CategoryEntity } from './category.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  id: string;

  @Column({ length: 50, unique: true, nullable: false })
  code: string;

  @Column({ length: 100, nullable: false })
  name: string;

  @Column('int', { name: 'price_without_tax' })
  priceWithoutTax: number;

  @Column('int', { name: 'price_with_tax' })
  priceWithTax: number;

  @Column({ length: 20, nullable: true })
  unit?: string;

  @Column({ length: 20, nullable: true })
  capacity?: string;

  @Column({ length: 50, nullable: true })
  specification?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ name: 'is_recoverable', default: false })
  isRecoverable: boolean;

  @Column({
    type: 'enum',
    enum: [ProductStatus.ON_SALE, ProductStatus.DISCONTINUED],
    default: ProductStatus.ON_SALE,
  })
  status: ProductStatus;

  @ManyToMany(() => CategoryEntity)
  @JoinTable({
    name: 'product_category',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories: CategoryEntity[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;
}

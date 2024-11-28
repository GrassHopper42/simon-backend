import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true, nullable: false })
  name: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId?: number;

  @ManyToOne(() => CategoryEntity, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children: CategoryEntity[];
}

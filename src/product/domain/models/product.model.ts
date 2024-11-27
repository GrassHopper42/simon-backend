import { Category } from './category.model';
import { Price } from '../value-objects/price.vo';
import { IsNotEmpty, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Product {
  private _id?: number;

  protected setId(id: number): void {
    this._id = id;
  }

  @IsNotEmpty({ message: '상품 코드는 필수입니다' })
  @MinLength(3, { message: '상품 코드는 최소 3글자 이상이어야 합니다' })
  private _code: string;

  @IsNotEmpty({ message: '상품 이름은 필수입니다' })
  private _name: string;

  @ValidateNested()
  @Type(() => Price)
  private _price: Price;

  @IsNotEmpty({ message: '상품 단위는 필수입니다' })
  private _unit: string;

  private _capacity: string;
  private _specification: string;
  private _description: string;

  private _isRecovarable: boolean;
  private _status: ProductStatus;

  @ValidateNested({ each: true })
  @Type(() => Category)
  private _categories: Category[];

  constructor(props: ProductProps) {
    this._id = props.id;
    this._code = props.code;
    this._name = props.name;
    this._price = props.price;
    this._unit = props.unit;
    this._capacity = props.capacity;
    this._specification = props.specification;
    this._description = props.description;
    this._isRecovarable = props.isRecovarable;
    this._status = props.status || ProductStatus.ON_SALE;
  }

  static create(props: Omit<ProductProps, 'id'>): Product {
    return new Product(props);
  }

  public updatePrice(newPrice: Price): void {
    this._price = newPrice;
  }

  public ChangeProductDetail(props: ProductDetailProps): Product {
    if (props.unit) {
      this._unit = props.unit;
    }

    if (props.capacity) {
      this._capacity = props.capacity;
    }

    if (props.specification) {
      this._specification = props.specification;
    }

    if (props.description) {
      this._description = props.description;
    }

    return this;
  }

  public resume(): Product {
    if (this._status === ProductStatus.ON_SALE) {
      throw new Error('이미 판매 중인 상품입니다');
    }
    this._status = ProductStatus.ON_SALE;
    return this;
  }

  public discontinue(): Product {
    if (this._status === ProductStatus.DISCONTINUED) {
      throw new Error('이미 판매 종료된 상품입니다');
    }
    this._status = ProductStatus.DISCONTINUED;
    return this;
  }

  public addCategory(category: Category): void {
    if (this._categories.some((c) => c.id === category.id)) {
      throw new Error('이미 등록된 카테고리입니다');
    }
    this._categories.push(category);
  }

  public removeCategory(categoryId: number): void {
    if (!this._categories.some((c) => c.id === categoryId)) {
      throw new Error('등록되지 않은 카테고리입니다');
    }
    this._categories = this._categories.filter((c) => c.id !== categoryId);
  }

  get id(): number | undefined {
    return this._id;
  }

  get code(): string {
    return this._code;
  }

  get name(): string {
    return this._name;
  }

  get price(): Price {
    return this._price;
  }

  get unit(): string {
    return this._unit;
  }

  get capacity(): string {
    return this._capacity;
  }

  get specification(): string {
    return this._specification;
  }

  get description(): string {
    return this._description;
  }

  get isRecovarable(): boolean {
    return this._isRecovarable;
  }

  get status(): ProductStatus {
    return this._status;
  }

  get categories(): Category[] {
    return this._categories;
  }
}

export interface ProductProps {
  id?: number | null;
  code: string;
  name: string;
  price: Price;
  unit: string;
  capacity: string;
  specification: string;
  description: string;
  isRecovarable: boolean;
  status?: ProductStatus | null;
  categories: Category[];
}

export interface ProductDetailProps {
  unit?: string;
  capacity?: string;
  specification?: string;
  description?: string;
}

export const ProductStatus = {
  ON_SALE: 'OnSale',
  DISCONTINUED: 'Discontinued',
};

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

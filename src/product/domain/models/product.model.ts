import { Category } from './category.model';
import { Price } from '../values/price.vo';
import { DomainValidationError } from 'src/common/error/validation';
export class Product {
  private _id?: number;

  private _code: string;
  private _name: string;
  private _price: Price;

  private _unit: string;
  private _capacity: string;
  private _specification: string;
  private _description: string;

  private _isRecovarable: boolean;
  private _status: ProductStatus;

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
    this._status = props.status ?? ProductStatus.ON_SALE;
    this._categories = props.categories;

    this.validateProduct();
  }

  private validateProduct(): void {
    if (this._code.length < 3) {
      throw new DomainValidationError('상품 코드는 3자 이상이어야 합니다');
    }

    if (!this.name || this.name.trim().length === 0) {
      throw new DomainValidationError('상품 이름은 필수입니다');
    }

    if (!this.price) {
      throw new DomainValidationError('상품 가격은 필수입니다');
    }

    if (!this.categories || this.categories.length === 0) {
      throw new DomainValidationError(
        '상품은 최소 1개 이상의 카테고리를 가져야 합니다',
      );
    }
  }

  public updatePrice(newPrice: Price): void {
    this._price = newPrice;
  }

  public updateProductDetail(props: ProductDetailProps): Product {
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
      throw new DomainValidationError('이미 판매 중인 상품입니다');
    }
    this._status = ProductStatus.ON_SALE;
    return this;
  }

  public discontinue(): Product {
    if (this._status === ProductStatus.DISCONTINUED) {
      throw new DomainValidationError('이미 판매 종료된 상품입니다');
    }
    this._status = ProductStatus.DISCONTINUED;
    return this;
  }

  public addCategory(category: Category): Product {
    if (this._categories.some((c) => c.id === category.id)) {
      throw new DomainValidationError('이미 등록된 카테고리입니다');
    }
    this._categories.push(category);
    return this;
  }

  public removeCategory(categoryId: number): Product {
    if (!this._categories.some((c) => c.id === categoryId)) {
      throw new DomainValidationError('등록되지 않은 카테고리입니다');
    }
    this._categories = this._categories.filter((c) => c.id !== categoryId);
    return this;
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
    return [...this._categories];
  }
}

export interface ProductProps {
  id?: number | null;
  code: string;
  name: string;
  price: Price;
  unit?: string;
  capacity?: string;
  specification?: string;
  description?: string;
  isRecovarable?: boolean;
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
} as const;

export type ProductStatus = (typeof ProductStatus)[keyof typeof ProductStatus];

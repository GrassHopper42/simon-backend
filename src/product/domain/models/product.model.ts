import { Category } from './category.model';
import { Price } from '../values/price.vo';
import { DomainValidationError } from 'src/common/error/validation';
import { AggregateRoot } from 'src/common/ddd/aggregate-root';
import { ProductPriceUpdated } from '../events/price-update.event';
import { Branded } from 'src/common/types/branded';
import { ProductPolicy } from '../policies/product.policy';

export type ProductId = Branded<string, 'ProductId'>;
export type ProductCode = Branded<string, 'ProductCode'>;

export class Product extends AggregateRoot<ProductId> {
  private _code: ProductCode;
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
    super(props.id);

    const codeValidation = ProductPolicy.validateCode(props.code);
    if (codeValidation.success === false) throw codeValidation.error;
    const nameValidation = ProductPolicy.validateName(props.name);
    if (nameValidation.success === false) throw nameValidation.error;
    const categoryValidation = ProductPolicy.validateCategories(
      props.categories,
    );
    if (categoryValidation.success === false) throw categoryValidation.error;

    this._code = codeValidation.value;
    this._name = nameValidation.value;
    this._price = props.price;
    this._unit = props.unit;
    this._capacity = props.capacity;
    this._specification = props.specification;
    this._description = props.description;
    this._isRecovarable = props.isRecovarable;
    this._status = props.status ?? ProductStatus.ON_SALE;
    this._categories = categoryValidation.value;
  }

  public updatePrice(newPrice?: Price): Product {
    if (!newPrice) return this;

    const oldPrice = this.price;

    this.addDomainEvent(
      new ProductPriceUpdated(this.id.toString(), oldPrice, this.price),
    );

    return new Product({
      ...this.toProductProps(),
      price: newPrice,
    });
  }

  public updateProductDetail(props: ProductDetailProps): Product {
    return new Product({
      ...this.toProductProps(),
      ...props,
    });
  }

  public resume(): Product {
    return new Product({
      ...this.toProductProps(),
      status: ProductStatus.ON_SALE,
    });
  }

  public discontinue(): Product {
    return new Product({
      ...this.toProductProps(),
      status: ProductStatus.DISCONTINUED,
    });
  }

  public setRecovarable(isRecovarable?: boolean): Product {
    if (isRecovarable === undefined) return this;
    return new Product({
      ...this.toProductProps(),
      isRecovarable,
    });
  }

  public hasCategory(categoryId: number): boolean {
    return this._categories.some((c) => c.id === categoryId);
  }

  public addCategory(category: Category): Product {
    if (this.hasCategory(category.id))
      throw new DomainValidationError('이미 추가된 카테고리입니다');
    return new Product({
      ...this.toProductProps(),
      categories: [...this._categories, category],
    });
  }

  public removeCategory(categoryId: number): Product {
    if (this._categories.length === 1)
      throw new DomainValidationError('최소 1개 이상의 카테고리가 필요합니다');
    if (!this.hasCategory(categoryId))
      throw new DomainValidationError('해당 카테고리가 없습니다');
    return new Product({
      ...this.toProductProps(),
      categories: this._categories.filter((c) => c.id !== categoryId),
    });
  }

  get code(): ProductCode {
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

  private toProductProps(): ProductProps {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      price: this.price,
      unit: this.unit,
      capacity: this.capacity,
      specification: this.specification,
      description: this.description,
      isRecovarable: this.isRecovarable,
      status: this.status,
      categories: this.categories,
    };
  }
}

export interface ProductProps extends ProductDetailProps {
  id?: ProductId | null;
  code: ProductCode;
  name: string;
  price: Price;
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

import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  readonly price: number;

  readonly unit?: string;
  readonly capacity?: string;
  readonly specification?: string;
  readonly description?: string;

  @IsBoolean()
  readonly isRecoverable: boolean;

  @IsNotEmpty()
  @IsString({ each: true })
  readonly categoryIds: string[];
}

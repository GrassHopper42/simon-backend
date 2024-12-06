import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly code: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  readonly unit?: string;
  readonly capacity: string;
  readonly specification: string;
  readonly description: string;
  readonly isRecovarable: boolean;

  @IsNotEmpty()
  @IsString({ each: true })
  readonly categoryIds: string[];
}

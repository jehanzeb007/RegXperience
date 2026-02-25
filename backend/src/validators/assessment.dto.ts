import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAssessmentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;
}

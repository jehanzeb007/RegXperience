import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { AssessmentStatus } from "../constants/assessmentStatus";

export class UpdateAssessmentFormDto {
  @IsString()
  @IsNotEmpty()
  controleOwner!: string;

  @IsString()
  @IsNotEmpty()
  implementationNote!: string;

  @IsString()
  @IsNotEmpty()
  status!: AssessmentStatus;
}

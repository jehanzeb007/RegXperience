import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from "class-validator";

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsIn(["client", "manager"])
  role?: "client" | "manager";
}

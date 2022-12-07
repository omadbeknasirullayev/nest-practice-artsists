import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AdminDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}

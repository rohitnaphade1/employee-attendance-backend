import { IsDateString, IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString() @MaxLength(64) employeeCode: string;
  @IsString() @MaxLength(100) firstName: string;
  @IsString() @MaxLength(100) lastName: string;
  @IsEmail() @MaxLength(150) email: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsOptional() @IsString() @MaxLength(100) department?: string;
  @IsOptional() @IsString() @MaxLength(100) designation?: string;
  @IsDateString() joiningDate: string;
  @IsOptional() @IsIn(['ACTIVE', 'INACTIVE']) status?: 'ACTIVE' | 'INACTIVE';
}

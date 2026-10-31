import { IsDateString, IsIn, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export class MarkAttendanceDto {
  @IsInt() employeeId: number;
  @IsDateString() attendanceDate: string;
  @IsIn(['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE']) status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
  @IsOptional() @IsString() @MaxLength(500) remarks?: string;
}

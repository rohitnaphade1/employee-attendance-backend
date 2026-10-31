import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('check-in/:employeeId')
  checkIn(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendanceService.checkIn(employeeId);
  }

  @Post('check-out/:employeeId')
  checkOut(@Param('employeeId', ParseIntPipe) employeeId: number) {
    return this.attendanceService.checkOut(employeeId);
  }

  @Post('mark')
  markAttendance(@Body() dto: MarkAttendanceDto) {
    return this.attendanceService.markAttendance(dto);
  }

  @Get()
  findAll(@Query('date') date?: string) {
    return this.attendanceService.findAll(date);
  }

  @Get('employee/:employeeId')
  findByEmployee(
    @Param('employeeId', ParseIntPipe) employeeId: number,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.attendanceService.findByEmployee(employeeId, from, to);
  }
}

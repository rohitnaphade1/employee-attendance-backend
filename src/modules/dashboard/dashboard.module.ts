import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Attendance } from '../attendance/entities/attendance.entity';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Attendance])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}

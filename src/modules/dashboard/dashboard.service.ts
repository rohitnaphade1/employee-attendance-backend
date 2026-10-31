import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from '../employees/entities/employee.entity';
import { Attendance } from '../attendance/entities/attendance.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async getSummary(date?: string) {
    const today = date || (() => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    })();

    const totalEmployees = await this.employeeRepository.count({ where: { status: 'ACTIVE' } });
    const [present, absent, halfDay, leave] = await Promise.all([
      this.attendanceRepository.count({ where: { attendanceDate: today, status: 'PRESENT' } }),
      this.attendanceRepository.count({ where: { attendanceDate: today, status: 'ABSENT' } }),
      this.attendanceRepository.count({ where: { attendanceDate: today, status: 'HALF_DAY' } }),
      this.attendanceRepository.count({ where: { attendanceDate: today, status: 'LEAVE' } }),
    ]);

    return {
      date: today,
      totalEmployees,
      present,
      absent,
      halfDay,
      leave,
      notMarked: Math.max(totalEmployees - present - absent - halfDay - leave, 0),
    };
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../employees/entities/employee.entity';
import { MarkAttendanceDto } from './dto/mark-attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
  ) {}

  private getToday(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }

  async checkIn(employeeId: number) {
    const employee = await this.employeeRepository.findOne({ where: { employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    if (employee.status !== 'ACTIVE') throw new BadRequestException('Employee is inactive');

    const attendanceDate = this.getToday();
    let record = await this.attendanceRepository.findOne({ where: { employeeId, attendanceDate } });

    if (record?.checkIn) throw new BadRequestException('Already checked in today');

    if (!record) {
      record = this.attendanceRepository.create({
        employeeId, attendanceDate, checkIn: new Date(), checkOut: null,
        status: 'PRESENT', remarks: null,
      });
    } else {
      record.checkIn = new Date();
      record.status = 'PRESENT';
    }
    return this.attendanceRepository.save(record);
  }

  async checkOut(employeeId: number) {
    const attendanceDate = this.getToday();
    const record = await this.attendanceRepository.findOne({ where: { employeeId, attendanceDate } });
    if (!record || !record.checkIn) throw new BadRequestException('Check in before checking out');
    if (record.checkOut) throw new BadRequestException('Already checked out today');

    record.checkOut = new Date();
    return this.attendanceRepository.save(record);
  }

  async markAttendance(dto: MarkAttendanceDto) {
    const employee = await this.employeeRepository.findOne({ where: { employeeId: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    let record = await this.attendanceRepository.findOne({
      where: { employeeId: dto.employeeId, attendanceDate: dto.attendanceDate },
    });

    if (!record) {
      record = this.attendanceRepository.create({
        employeeId: dto.employeeId,
        attendanceDate: dto.attendanceDate,
        checkIn: null,
        checkOut: null,
        status: dto.status,
        remarks: dto.remarks ?? null,
      });
    } else {
      record.status = dto.status;
      record.remarks = dto.remarks ?? null;
    }
    return this.attendanceRepository.save(record);
  }

  findAll(date?: string) {
    return this.attendanceRepository.find({
      where: date ? { attendanceDate: date } : {},
      relations: { employee: true },
      order: { attendanceDate: 'DESC', attendanceId: 'DESC' },
    });
  }

  async findByEmployee(employeeId: number, from?: string, to?: string) {
    const employee = await this.employeeRepository.findOne({ where: { employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    const query = this.attendanceRepository.createQueryBuilder('attendance')
      .where('attendance.employeeId = :employeeId', { employeeId });

    if (from) query.andWhere('attendance.attendanceDate >= :from', { from });
    if (to) query.andWhere('attendance.attendanceDate <= :to', { to });

    return query.orderBy('attendance.attendanceDate', 'DESC').getMany();
  }
}

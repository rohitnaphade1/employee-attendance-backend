import {
  Column, CreateDateColumn, Entity, JoinColumn, ManyToOne,
  PrimaryGeneratedColumn, Unique, UpdateDateColumn,
} from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';

@Entity('attendance')
@Unique('UQ_attendance_employee_date', ['employeeId', 'attendanceDate'])
export class Attendance {
  @PrimaryGeneratedColumn()
  attendanceId: number;

  @Column({ type: 'int' })
  employeeId: number;

  @ManyToOne(() => Employee, (employee) => employee.attendances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId', referencedColumnName: 'employeeId' })
  employee: Employee;

  @Column({ type: 'date' })
  attendanceDate: string;

  @Column({ type: 'datetime', nullable: true })
  checkIn: Date | null;

  @Column({ type: 'datetime', nullable: true })
  checkOut: Date | null;

  @Column({ type: 'enum', enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE'], default: 'PRESENT' })
  status: AttendanceStatus;

  @Column({ type: 'varchar', length: 500, nullable: true })
  remarks: string | null;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;
}

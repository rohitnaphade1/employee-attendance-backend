import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Attendance } from '../../attendance/entities/attendance.entity';

@Entity('employee')
export class Employee {
  @PrimaryGeneratedColumn({ type: 'integer' })
  employeeId: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  employeeCode: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  department: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  designation: string | null;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'enum', enum: ['ACTIVE', 'INACTIVE'], default: 'ACTIVE' })
  status: 'ACTIVE' | 'INACTIVE';

  @OneToMany(() => User, (user) => user.employee)
  users: User[];

  @OneToMany(() => Attendance, (attendance) => attendance.employee)
  attendances: Attendance[];
}

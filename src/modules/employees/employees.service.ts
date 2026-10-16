
import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Employee } from './entities/employee.entity';
import { User } from '../user/entities/user.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    return this.dataSource.transaction(async (manager) => {
      const employeeRepository = manager.getRepository(Employee);
      const userRepository = manager.getRepository(User);

      const {
        employeeCode,
        email,
        phone,
      } = createEmployeeDto;

      // Check employee code
      const existingEmployeeCode = await employeeRepository.findOne({
        where: { employeeCode },
      });

      if (existingEmployeeCode) {
        throw new ConflictException('Employee code already exists');
      }

      // Check email in employee table
      const existingEmployeeEmail = await employeeRepository.findOne({
        where: { email },
      });

      if (existingEmployeeEmail) {
        throw new ConflictException('Email already exists');
      }

      // Check email in users table
      const existingUserEmail = await userRepository.findOne({
        where: { email },
      });

      if (existingUserEmail) {
        throw new ConflictException('Email already exists');
      }

      // Check mobile number
      if (phone) {
        const existingPhone = await employeeRepository.findOne({
          where: { phone },
        });

        if (existingPhone) {
          throw new ConflictException('Mobile number already exists');
        }
      }

      // Create employee
      const employee = employeeRepository.create({
        ...createEmployeeDto,
        joiningDate: new Date(createEmployeeDto.joiningDate),
      });

      const savedEmployee = await employeeRepository.save(employee);

      // Generate default password hash
      const hashedPassword = await bcrypt.hash('Test@123$', 10);

      // Create user login account
      const user = userRepository.create({
        email: savedEmployee.email,
        password: hashedPassword,
        employee: savedEmployee,
      });

      await userRepository.save(user);

      const { password: _, ...safeUser } = user;

      return {
        message: 'Employee registered successfully',
        employee: savedEmployee,
        user: safeUser,
      };
    });
  }
}

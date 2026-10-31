import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(dto: CreateEmployeeDto) {
    const duplicate = await this.employeeRepository.findOne({
      where: [{ email: dto.email }, { employeeCode: dto.employeeCode }],
    });
    if (duplicate) throw new ConflictException('Employee email or code already exists');
    return this.employeeRepository.save(this.employeeRepository.create(dto));
  }

  findAll() {
    return this.employeeRepository.find({ order: { employeeId: 'DESC' } });
  }

  async findOne(employeeId: number) {
    const employee = await this.employeeRepository.findOne({ where: { employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');
    return employee;
  }

  async update(employeeId: number, dto: UpdateEmployeeDto) {
    const employee = await this.findOne(employeeId);
    if (dto.email && dto.email !== employee.email) {
      const duplicate = await this.employeeRepository.findOne({ where: { email: dto.email } });
      if (duplicate) throw new ConflictException('Email already exists');
    }
    if (dto.employeeCode && dto.employeeCode !== employee.employeeCode) {
      const duplicate = await this.employeeRepository.findOne({ where: { employeeCode: dto.employeeCode } });
      if (duplicate) throw new ConflictException('Employee code already exists');
    }
    Object.assign(employee, dto);
    return this.employeeRepository.save(employee);
  }

  async remove(employeeId: number) {
    const employee = await this.findOne(employeeId);
    await this.employeeRepository.remove(employee);
    return { message: 'Employee deleted successfully' };
  }
}

import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Employee } from '../employees/entities/employee.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Employee) private readonly employeeRepository: Repository<Employee>,
  ) {}

  async create(dto: CreateUserDto) {
    const employee = await this.employeeRepository.findOne({ where: { employeeId: dto.employeeId } });
    if (!employee) throw new NotFoundException('Employee not found');

    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('User email already exists');

    const user = this.userRepository.create({
      email: dto.email,
      password: await bcrypt.hash(dto.password, 10),
      employee,
    });
    const saved = await this.userRepository.save(user);
    return { message: 'User created successfully', userId: saved.userId, email: saved.email };
  }

  findAll() {
    return this.userRepository.find({
      relations: { employee: true },
      select: {
        userId: true,
        email: true,
        createdAt: true,
        employee: { employeeId: true, employeeCode: true, firstName: true, lastName: true },
      },
      order: { userId: 'DESC' },
    });
  }
}

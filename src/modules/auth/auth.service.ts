import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
      relations: { employee: true },
      select: {
        userId: true,
        email: true,
        password: true,
        createdAt: true,
        employee: {
          employeeId: true,
          employeeCode: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          department: true,
          designation: true,
          joiningDate: true,
          status: true,
        },
      },
    });

    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid email or password');

    if (user.employee.status !== 'ACTIVE') {
      throw new UnauthorizedException('Employee account is inactive');
    }

    const { password: _password, ...safeUser } = user;
    return { message: 'Login successful', user: safeUser };
  }
}

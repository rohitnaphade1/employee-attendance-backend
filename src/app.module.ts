import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './modules/employees/entities/employee.entity';
import { User } from './modules/user/entities/user.entity';
import { Attendance } from './modules/attendance/entities/attendance.entity';
import { EmployeesModule } from './modules/employees/employees.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: Number(config.get<string>('DB_PORT', '3306')),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD', ''),
        database: config.get<string>('DB_DATABASE', 'employee_attendance_db'),
        entities: [Employee, User, Attendance],
        synchronize: true,
      }),
    }),
    EmployeesModule,
    UserModule,
    AuthModule,
    AttendanceModule,
    DashboardModule,
  ],
})
export class AppModule {}

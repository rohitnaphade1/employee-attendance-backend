import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post() create(@Body() dto: CreateEmployeeDto) { return this.employeesService.create(dto); }
  @Get() findAll() { return this.employeesService.findAll(); }
  @Get(':employeeId') findOne(@Param('employeeId', ParseIntPipe) id: number) { return this.employeesService.findOne(id); }
  @Patch(':employeeId') update(@Param('employeeId', ParseIntPipe) id: number, @Body() dto: UpdateEmployeeDto) {
    return this.employeesService.update(id, dto);
  }
  @Delete(':employeeId') remove(@Param('employeeId', ParseIntPipe) id: number) { return this.employeesService.remove(id); }
}

import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { Company, CreateCompanyParams } from 'messe-lager-dto';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  public constructor(private readonly companyService: CompanyService) {}

  @Get()
  public async getCompanys(): Promise<Company[]> {
    return this.companyService.getCompanys();
  }

  @Post()
  public async createCompany(
    @Body() dataPlain: CreateCompanyParams,
  ): Promise<Company> {
    const data = plainToClass(CreateCompanyParams, dataPlain);

    const validationErrors = await validate(data);
    if (validationErrors.length > 0) {
      throw new HttpException(
        validationErrors[0].toString(),
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.companyService.createCompany(data);
  }
}

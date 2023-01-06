import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyParams } from 'messe-lager-dto';
import { Repository } from 'typeorm';
import { Company } from './company.model';

@Injectable()
export class CompanyService {
  public constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  public async getCompanys(): Promise<Company[]> {
    return this.companyRepository.find();
  }

  public async createCompany(data: CreateCompanyParams): Promise<Company> {
    const company = new Company();
    company.id = data.id;
    company.day = data.day;
    company.name = data.name;

    return this.companyRepository.save(company);
  }
}

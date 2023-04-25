import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCompanyParams } from 'messe-lager-dto';
import { Packet } from 'src/packet/packet.model';
import { IsNull, Not, Repository } from 'typeorm';
import { Company } from './company.model';

@Injectable()
export class CompanyService {
  public constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(Packet)
    private packetRepository: Repository<Packet>,
  ) {}

  public async getCompanys(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: ['packets'],
    });
  }

  public async findCompany(id: number): Promise<Company | null> {
    return this.companyRepository.findOne({
      where: { id },
      relations: ['packets', 'packets.movements'],
    });
  }

  public async getMainLocation(id: number): Promise<{ location: string }> {
    const company = await this.companyRepository.findOneByOrFail({ id });

    const locationCounts = await this.packetRepository
      .createQueryBuilder('packet')
      .select('COUNT(*) AS counter, location')
      .addGroupBy('location')
      .addOrderBy('counter', 'DESC')
      .andWhere('companyId = :cid', { cid: company.id })
      .andWhere({ location: Not(IsNull()) })
      .getRawMany();

    if (locationCounts.length === 0) {
      return { location: '' };
    }

    return { location: locationCounts[0].location };
  }

  public async createCompany(data: CreateCompanyParams): Promise<Company> {
    const company = new Company();
    company.id = data.id;
    company.day = data.day;
    company.name = data.name;
    company.booth = data.booth;

    return this.companyRepository.save(company);
  }

  public async upsertCompany(data: CreateCompanyParams): Promise<Company> {
    const existingEntity = await this.companyRepository.findOneBy({
      id: data.id,
    });

    if (existingEntity) {
      existingEntity.day = data.day;
      existingEntity.name = data.name;
      existingEntity.booth = data.booth;

      return this.companyRepository.save(existingEntity);
    }

    return this.createCompany(data);
  }
}

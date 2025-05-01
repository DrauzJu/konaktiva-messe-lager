import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import {
  BatchCreateFromCSVParams,
  Company,
  CreateCompanyParams,
} from 'messe-lager-dto';
import { CsvParser, ParsedData } from 'nest-csv-parser';
import { Readable } from 'stream';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
  public constructor(
    private readonly companyService: CompanyService,
    private readonly csvParser: CsvParser,
  ) {}

  @Get()
  public async getCompanys(): Promise<Company[]> {
    return this.companyService.getCompanys();
  }

  @Get(':id')
  public async getCompany(@Param('id') id: number): Promise<Company> {
    const company = await this.companyService.findCompany(id);
    if (company === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }

    return company;
  }

  @Get(':id/mainLocation')
  public async getMainLocation(
    @Param('id') id: number,
  ): Promise<{ location: string }> {
    return this.companyService.getMainLocation(id);
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

  @Post('batchCreateFromCSV')
  public async batchCreateFromCSV(
    @Body() input: BatchCreateFromCSVParams,
  ): Promise<void> {
    const inputStream = Readable.from(input.data);
    let parsedInputData: ParsedData<CreateCompanyParams>;

    try {
      parsedInputData = await this.csvParser.parse(
        inputStream,
        CreateCompanyParams,
      );
    } catch (e) {
      throw new HttpException('Invalid CSV', HttpStatus.BAD_REQUEST);
    }

    const validatedData = await Promise.all(
      parsedInputData.list.map(async (rawObj) => {
        const newCompany = plainToClass(CreateCompanyParams, rawObj);
        const validationErrors = await validate(newCompany);
        if (validationErrors.length > 0) {
          throw new HttpException(
            validationErrors[0].toString(),
            HttpStatus.BAD_REQUEST,
          );
        }

        return newCompany;
      }),
    );

    await Promise.all(
      validatedData.map((data) => this.companyService.upsertCompany(data)),
    );
  }

  @Delete()
  public async deleteCompanys(): Promise<void> {
    await this.companyService.deleteCompanys();
  }
}

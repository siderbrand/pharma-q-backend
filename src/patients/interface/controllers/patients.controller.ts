import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetPatientUseCase } from '../../application/use-cases/get-patient.use-case';
import { PatientResponseDto } from '../../application/dto/patient-response.dto';
import { PatientParamDto } from '../dto/patient-param.dto';

class ErrorResponseDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  error: string;

  @ApiProperty({ example: 'Paciente no encontrado' })
  message: string | string[];

  @ApiProperty({ example: '/patients/11111111' })
  path: string;

  @ApiProperty({ example: 'GET' })
  method: string;

  @ApiProperty({ example: '2026-04-01T18:22:01.121Z' })
  timestamp: string;
}

@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(
    private readonly getPatientUseCase: GetPatientUseCase,
  ) {}

  @Get(':document')
  @ApiOperation({ summary: 'Consultar paciente por documento' })
  @ApiParam({ name: 'document', description: 'Documento del paciente', example: '12345678' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado', type: PatientResponseDto })
  @ApiResponse({
    status: 400,
    description: 'Documento invalido',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Paciente no encontrado',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 503,
    description: 'Falla temporal en infraestructura de datos',
    type: ErrorResponseDto,
  })
  async getByDocument(
    @Param() params: PatientParamDto,
  ): Promise<PatientResponseDto> {
    return this.getPatientUseCase.execute(params.document);
  }
}
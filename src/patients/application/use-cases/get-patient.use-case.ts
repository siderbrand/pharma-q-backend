import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PATIENT_REPOSITORY } from '../../domain/interfaces/patient.repository.interface';
import type { PatientRepository } from '../../domain/interfaces/patient.repository.interface';
import { PatientResponseDto } from '../dto/patient-response.dto';

@Injectable()
export class GetPatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: PatientRepository,
  ) {}

  async execute(document: string): Promise<PatientResponseDto> {
    const patient = await this.patientRepository.findByDocument(document);

    if (!patient) {
      throw new NotFoundException('Paciente no encontrado');
    }

    return {
      name: patient.name,
      document: patient.document,
      preferencial: patient.preferencial,
    };
  }
}

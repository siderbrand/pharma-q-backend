import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GetPatientUseCase } from './application/use-cases/get-patient.use-case';
import { PATIENT_REPOSITORY } from './domain/interfaces/patient.repository.interface';
import {
  PatientDocumentModel,
  PatientSchema,
} from './infrastructure/persistence/patient.schema';
import { MongoPatientRepository } from './infrastructure/repositories/mongo-patient.repository';
import { PatientsController } from './interface/controllers/patients.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PatientDocumentModel.name, schema: PatientSchema },
    ]),
  ],
  controllers: [PatientsController],
  providers: [
    GetPatientUseCase,
    {
      provide: PATIENT_REPOSITORY,
      useClass: MongoPatientRepository,
    },
  ],
})
export class PatientsModule {}
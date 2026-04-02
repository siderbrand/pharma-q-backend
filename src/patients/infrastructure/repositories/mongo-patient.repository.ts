import {
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, MongooseError } from 'mongoose';
import { Patient } from '../../domain/entities/patient.entity';
import { PatientRepository } from '../../domain/interfaces/patient.repository.interface';
import { PatientDocumentModel } from '../persistence/patient.schema';

@Injectable()
export class MongoPatientRepository implements PatientRepository {
  constructor(
    @InjectModel(PatientDocumentModel.name)
    private readonly patientModel: Model<PatientDocumentModel>,
  ) {}

  async findByDocument(document: string): Promise<Patient | null> {
    try {
      const patient = await this.patientModel
        .findOne({ documentNumber: document })
        .lean()
        .exec();

      if (!patient) {
        return null;
      }

      return new Patient(
        patient.name,
        patient.documentNumber,
        patient.preferencial ?? false,
      );
    } catch (error: unknown) {
      if (error instanceof MongooseError) {
        throw new ServiceUnavailableException(
          'No fue posible consultar pacientes en este momento',
        );
      }

      throw new InternalServerErrorException(
        'Se produjo un error interno al consultar el paciente',
      );
    }
  }
}

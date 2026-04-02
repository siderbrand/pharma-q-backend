import { Patient } from '../entities/patient.entity';

export const PATIENT_REPOSITORY = 'PATIENT_REPOSITORY';

export interface PatientRepository {
  findByDocument(document: string): Promise<Patient | null>;
}
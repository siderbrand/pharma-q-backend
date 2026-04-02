import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { GetPatientUseCase } from '../src/patients/application/use-cases/get-patient.use-case';
import { GlobalExceptionFilter } from '../src/common/filters/global-exception.filter';
import { Patient } from '../src/patients/domain/entities/patient.entity';
import {
  PATIENT_REPOSITORY,
  PatientRepository,
} from '../src/patients/domain/interfaces/patient.repository.interface';
import { PatientsController } from '../src/patients/interface/controllers/patients.controller';

describe('PatientsController (e2e)', () => {
  let app: INestApplication<App>;

  const patientRepositoryStub: PatientRepository = {
    async findByDocument(document: string): Promise<Patient | null> {
      if (document === '12345678') {
        return new Patient('Juan Perez', '12345678', false);
      }

      return null;
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [
        GetPatientUseCase,
        {
          provide: PATIENT_REPOSITORY,
          useValue: patientRepositoryStub,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  it('/patients/:document (GET)', () => {
    return request(app.getHttpServer())
      .get('/patients/12345678')
      .expect(200)
      .expect({
        name: 'Juan Perez',
        document: '12345678',
        preferencial: false,
      });
  });

  it('returns 404 for unknown patient', () => {
    return request(app.getHttpServer())
      .get('/patients/11111111')
      .expect(404)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 404,
            error: 'Not Found',
            message: 'Paciente no encontrado',
            path: '/patients/11111111',
            method: 'GET',
          }),
        );
        expect(typeof response.body.timestamp).toBe('string');
      });
  });

  it('returns 400 for invalid document format', () => {
    return request(app.getHttpServer())
      .get('/patients/ABC123')
      .expect(400)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            statusCode: 400,
            error: 'Bad Request',
            path: '/patients/ABC123',
            method: 'GET',
          }),
        );
        expect(response.body.message).toContain(
          'El documento debe contener solo numeros y tener entre 5 y 15 digitos',
        );
        expect(typeof response.body.timestamp).toBe('string');
      });
  });
});

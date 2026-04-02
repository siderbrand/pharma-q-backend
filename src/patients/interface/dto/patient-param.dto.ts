import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class PatientParamDto {
  @ApiProperty({
    example: '12345678',
    description: 'Documento del paciente en formato numerico',
  })
  @IsNotEmpty()
  @Matches(/^\d{5,15}$/, {
    message: 'El documento debe contener solo numeros y tener entre 5 y 15 digitos',
  })
  document: string;
}

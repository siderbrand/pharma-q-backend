import { ApiProperty } from '@nestjs/swagger';

export class PatientResponseDto {
  @ApiProperty({ example: 'Juan Perez' })
  name: string;

  @ApiProperty({ example: '12345678' })
  document: string;

  @ApiProperty({ example: false })
  preferencial: boolean;
}
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ collection: 'patients', versionKey: false })
export class PatientDocumentModel {
  @Prop({ required: true })
  documentType: string;

  @Prop({ required: true, unique: true, index: true })
  documentNumber: string;

  @Prop({ required: true })
  name: string;

  @Prop({ default: false })
  preferencial: boolean;
}

export type PatientDocument = HydratedDocument<PatientDocumentModel>;

export const PatientSchema = SchemaFactory.createForClass(PatientDocumentModel);

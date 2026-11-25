import { Module } from '@nestjs/common';
import { PplController } from './ppl.controller';

@Module({ controllers: [PplController] })
export class PplModule {}

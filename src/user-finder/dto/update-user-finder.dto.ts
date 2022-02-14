import { PartialType } from '@nestjs/mapped-types';
import { CreateUserFinderDto } from './create-user-finder.dto';

export class UpdateUserFinderDto extends PartialType(CreateUserFinderDto) {}

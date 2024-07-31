import { PartialType } from '@nestjs/swagger';

import { CreateMenuDto } from './menu-create.dto';

export class MenuUpdateDto extends PartialType(CreateMenuDto) {}

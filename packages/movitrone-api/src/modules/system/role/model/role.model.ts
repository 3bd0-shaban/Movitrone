import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../entity/role.entity';

export class RoleInfo extends RoleEntity {
  @ApiProperty({ type: [Number] })
  menuIds: number[];
}

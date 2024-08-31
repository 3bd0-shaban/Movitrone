import { Exclude } from 'class-transformer';
import { CompleteEntity } from '~/common/entity/common.entity';
import { Column, VirtualColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class UserShared extends CompleteEntity {
  @Column()
  @ApiProperty({ description: 'firstname' })
  firstname: string;

  @Column()
  @ApiProperty({ description: 'lastname' })
  lastname: string;

  @Column()
  @ApiProperty({ description: 'formatted phone number' })
  phone: string;

  @Column()
  @ApiProperty({ description: 'user email' })
  email: string;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CONCAT(${alias}.first_name, ' ', ${alias}.last_name)`,
  })
  fullName!: string;

  @Exclude()
  @ApiProperty({ description: 'user password' })
  @Column({ select: false })
  password: string;

  @ApiProperty({ description: 'user avatar link' })
  @Column()
  avatar: string;
}

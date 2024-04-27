import { Exclude } from 'class-transformer';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Column } from 'typeorm';

export class UserShared extends CommonEntity {
  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ select: false })
  password: string;
}

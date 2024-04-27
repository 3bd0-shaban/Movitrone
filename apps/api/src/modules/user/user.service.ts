import { Injectable, ConflictException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { PhoneValidationService } from '@common/services';
import { isEmpty, isNil } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Compare entered and database passwords
   *
   * @param {CreateUserDTO} - enterted inputs
   * @returns {Promise<UserEntity>} - Password match result
   * @memberof UserService
   */
  async create(createUserDto: CreateUserDTO): Promise<UserEntity> {
    const { email, phone, code } = createUserDto;
    const exists = await this.userRepository.findOneBy({
      email,
    });
    if (!isEmpty(exists))
      throw new ConflictException(ErrorEnum.SYSTEM_USER_EXISTS);

    const formattedPhoneNumber = this.authService.validateAndFormatPhoneNumber({
      code,
      number: phone,
    });

    const hashedPassword = await this.authService.hashPassword(
      createUserDto.password,
    );

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      phone: formattedPhoneNumber,
    });
    return await user.save();
  }

  async findAll(
    query: PaginationArgs,
  ): Promise<{ users: UserEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip,
    });
    return { total, results: users.length, users };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

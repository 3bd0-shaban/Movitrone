import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';
import { PasswordUpdateDto } from 'src/shared/dto/password.dto';

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
   * @param {CreateUserDTO} createUserDto - enterted inputs
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

  /**
   * Compare entered and database passwords
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ users: UserEntity[]; results: number; total: number }>} - Paginated users
   * @memberof UserService
   */
  async findAll(
    pagination: PaginationArgs,
  ): Promise<{ users: UserEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [users, total] = await this.userRepository.findAndCount({
      take: limit,
      skip,
    });
    return { total, results: users.length, users };
  }

  /**
   * Find a user by ID
   *
   * @param {number} id - User ID
   * @returns {Promise<UserEntity>} - The found user
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Update a user password by ID
   *
   * @param {number} id - User ID
   * @param {PasswordUpdateDto} inputs - Updated user data
   * @returns {Promise<boolean>} - Indicates whether the password update was successful
   * @throws {NotFoundException} - If the user with the provided ID is not found
   * @throws {UnprocessableEntityException} - If the old password doesn't match
   */
  async updatePasswordById(
    id: number,
    inputs: PasswordUpdateDto,
  ): Promise<boolean> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.email', 'user.password'])
      .where('id = :id', { id })
      .getOne();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const isMatch = await this.authService.comparePassword(
      inputs.oldPassword,
      user.password,
    );

    if (!isMatch) {
      throw new UnprocessableEntityException(ErrorEnum.PASSWORD_MISMATCH);
    }

    const hashedPassword = await this.authService.hashPassword(
      inputs.newPassword,
    );

    await this.userRepository.update(id, { password: hashedPassword });

    return true;
  }

  /**
   * Remove a user by ID
   *
   * @param {number} id - User ID
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async removeById(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  /**
   * Update the currently authenticated user
   *
   * @param {number} userId - User ID (assuming it's the authenticated user's ID)
   * @param {UpdateUserDTO} updateUserDto - Updated user data
   * @returns {Promise<UserEntity>} - The updated user
   */
  async update(
    userId: number,
    updateUserDto: updateUserDTO,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(userId, updateUserDto);
  }
}

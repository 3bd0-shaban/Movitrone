import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from 'src/shared/dto/create-user.dto';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';

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
   * Update a user by ID
   *
   * @param {number} id - User ID
   * @param {UpdateUserDTO} updateUserDto - Updated user data
   * @returns {Promise<UserEntity>} - The updated user
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async updateById(
    id: number,
    updateUserDto: updateUserDTO,
  ): Promise<UserEntity> {
    // Find the user by ID
    const user = await this.findOne(id);

    // Update user data
    Object.assign(user, updateUserDto);

    // Save the updated user
    return await this.userRepository.save(user);
  }

  /**
   * Remove a user by ID
   *
   * @param {number} id - User ID
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async removeById(id: number): Promise<void> {
    // Find the user by ID
    const user = await this.findOne(id);

    // Remove the user
    await this.userRepository.remove(user);
  }

  /**
   * Update the currently authenticated user
   *
   * @param {number} userId - User ID (assuming it's the authenticated user's ID)
   * @param {UpdateUserDTO} updateUserDto - Updated user data
   * @returns {Promise<UserEntity>} - The updated user
   */
  async updateSelf(
    userId: number,
    updateUserDto: updateUserDTO,
  ): Promise<UserEntity> {
    return this.updateById(userId, updateUserDto);
  }
}

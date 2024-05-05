import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorEnum } from 'src/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { AuthService } from '../auth/auth.service';
import { PaginationArgs } from 'src/shared/dto/args/pagination-query.args';
import { updateUserDTO } from 'src/shared/dto/update-user.dto';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly authService: AuthService,
  ) {}

  /**
   * create new admin user
   *
   * @param {CreateAdminDto} inputs - enterted inputs
   * @returns {Promise<AdminEntity>} - Password match result
   * @memberof UserService
   */
  async create(inputs: CreateAdminDto): Promise<AdminEntity> {
    const { email, phone, code } = inputs;
    const exists = await this.adminRepository.findOneBy({
      email,
    });
    if (!isEmpty(exists))
      throw new ConflictException(ErrorEnum.SYSTEM_USER_EXISTS);

    const formattedPhoneNumber = this.authService.validateAndFormatPhoneNumber({
      code,
      number: phone,
    });

    const hashedPassword = await this.authService.hashPassword(inputs.password);

    const user = this.adminRepository.create({
      ...inputs,
      password: hashedPassword,
      phone: formattedPhoneNumber,
    });
    return await user.save();
  }

  /**
   * find all users in dashboard by role
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ users: AdminEntity[]; results: number; total: number }>} - Paginated users
   * @memberof UserService
   */
  async findAll(
    pagination: PaginationArgs,
  ): Promise<{ users: AdminEntity[]; results: number; total: number }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const [users, total] = await this.adminRepository.findAndCount({
      take: limit,
      skip,
    });
    return { total, results: users.length, users };
  }

  /**
   * Find admin by ID
   *
   * @param {number} id - admin ID
   * @returns {Promise<AdminEntity>} - The found user
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async findOne(id: number): Promise<AdminEntity> {
    const user = await this.adminRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`dasboard user with ID ${id} not found`);
    }
    return user;
  }

  /**
   * Remove admin by ID
   *
   * @param {number} id - User ID
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async removeById(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.adminRepository.remove(user);
  }

  /**
   * Update admin by user ID
   *
   * @param {number} userId - User ID
   * @param {UpdateUserDTO} updateUserDto - Updated user data
   * @returns {Promise<AdminEntity>} - The updated user
   */
  async updateById(
    userId: number,
    updateUserDto: updateUserDTO,
  ): Promise<AdminEntity> {
    const user = await this.findOne(userId);

    // Update user data
    Object.assign(user, updateUserDto);
    return await this.adminRepository.save(user);
  }
}

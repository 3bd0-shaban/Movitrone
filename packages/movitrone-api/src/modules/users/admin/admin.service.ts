import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ErrorEnum } from '~/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { AuthService } from '../../auth/auth.service';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { updateUserDTO } from '~/shared/dto/inputs/update-user.dto';
import { AdminEntity } from './entities/admin.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { PasswordUpdateDto } from '~/shared/dto/inputs/password.dto';
import { ADMIN_ROLES_ENUMS } from './admin.constant';
import { Pagination } from '~/helper/paginate/pagination';
import { paginate } from '~/helper/paginate';
import { PagerDto } from '~/common/dto/pager.dto';

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
   * @param {ADMIN_ROLES_ENUMS} role - pagination inputs
   * @returns {Promise<{ users: AdminEntity[]; results: number; total: number }>} - Paginated users
   * @memberof UserService
   */
  async findAll({
    page = 1,
    pageSize = 10,
    role,
  }: PagerDto & { role: ADMIN_ROLES_ENUMS }): Promise<Pagination<AdminEntity>> {
    const queryBuilder = this.adminRepository.createQueryBuilder('admin');

    if (role) {
      queryBuilder.andWhere('admin.role = :role', { role });
    }

    // Paginate using utility function
    return paginate<AdminEntity>(queryBuilder, { page, pageSize });
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
    const user = await this.adminRepository
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

    await this.adminRepository.update(id, { password: hashedPassword });

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
    await this.adminRepository.remove(user);
  }

  /**
   * Update the currently authenticated user
   *
   * @param {number} userId - User ID (assuming it's the authenticated user's ID)
   * @param {UpdateUserDTO} updateUserDto - Updated user data
   * @returns {Promise<AdminEntity>} - The updated user
   */
  async update(
    userId: number,
    updateUserDto: updateUserDTO,
  ): Promise<UpdateResult> {
    return await this.adminRepository.update(userId, updateUserDto);
  }
}

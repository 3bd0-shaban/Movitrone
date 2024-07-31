import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientEntity } from './entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDTO } from '~/shared/dto/inputs/create-user.dto';
import { ErrorEnum } from '~/constants/error-code.constant';
import { isEmpty } from 'lodash';
import { AuthService } from '../../auth/auth.service';
import { PaginationArgs } from '~/shared/dto/args/pagination-query.args';
import { updateUserDTO } from '~/shared/dto/inputs/update-user.dto';
import { PasswordUpdateDto } from '~/shared/dto/inputs/password.dto';
import { randomValue } from '~/utils/tool.util';
import { EmailService } from '~/shared/mailer/mailer.service';
import { VerifyOTPDTOs } from './dto/verify-otp.dto';
import { paginate } from '~/helper/paginate';
import { Pagination } from '~/helper/paginate/pagination';
import { PagerDto } from '~/common/dto/pager.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(ClientEntity)
    private readonly userRepository: Repository<ClientEntity>,
    private readonly authService: AuthService,
    private readonly mailerService: EmailService,
  ) {}

  /**
   * Compare entered and database passwords
   *
   * @param {CreateUserDTO} createUserDto - enterted inputs
   * @returns {Promise<ClientEntity>} - Password match result
   * @memberof UserService
   */
  async create(createUserDto: CreateUserDTO): Promise<ClientEntity> {
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

    const otp = randomValue(4, '1234567890');
    this.mailerService.sendVerificationCode(email, otp);

    const user = this.userRepository.create({
      ...createUserDto,
      otp,
      password: hashedPassword,
      phone: formattedPhoneNumber,
    });
    return await user.save();
  }

  /**
   * Compare entered and database passwords
   *
   * @param {PaginationArgs} pagination - pagination inputs
   * @returns {Promise<{ users: ClientEntity[]; results: number; total: number }>} - Paginated users
   * @memberof UserService
   */
  async findAll({
    page,
    pageSize,
  }: PagerDto): Promise<Pagination<ClientEntity>> {
    return paginate(this.userRepository, { page, pageSize });
  }

  /**
   * Find a user by ID
   *
   * @param {number} id - User ID
   * @returns {Promise<ClientEntity>} - The found user
   * @throws {NotFoundException} - If the user with the provided ID is not found
   */
  async findOne(id: number): Promise<ClientEntity> {
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
   * @returns {Promise<ClientEntity>} - The updated user
   */
  async update(
    userId: number,
    updateUserDto: updateUserDTO,
  ): Promise<UpdateResult> {
    return await this.userRepository.update(userId, updateUserDto);
  }

  /**
   * Update user to veified if valid otp
   *
   * @param {number} userId - User ID (assuming it's the authenticated user's ID)
   * @param {VerifyOTPDTOs} inputs - otp
   * @returns {Promise<UpdateResult>} - UpdateResult
   */
  async VerifyOTP(
    userId: number,
    inputs: VerifyOTPDTOs,
  ): Promise<UpdateResult> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (user.otp !== inputs.otp) {
      throw new UnprocessableEntityException(
        ErrorEnum.INVALID_VERIFICATION_CODE,
      );
    }
    return await this.userRepository.update(userId, { is_Verified: true });
  }
}

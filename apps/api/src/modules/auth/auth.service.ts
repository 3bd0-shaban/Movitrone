import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import * as bcrypt from 'bcrypt';
import { PhoneValidationService } from '@common/services';

@Injectable()
export class AuthService {
  constructor(private phoneValidationService: PhoneValidationService) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
  /**
   * Compare entered and database passwords
   *
   * @param {string} enteredPassword - Entered password
   * @param {string} dbPassword - Database password
   * @returns {Promise<boolean>} - Password match result
   * @memberof AuthService
   */
  async comparePassword(
    enteredPassword: string,
    dbPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  /**
   * Hash the provided password
   *
   * @param {string} password - Password to hash
   * @returns {Promise<string>} - Hashed password
   * @memberof AuthService
   */
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
  }

  validateAndFormatPhoneNumber(phone: {
    number: string;
    code: string;
  }): string {
    return this.phoneValidationService.validatePhoneNumber(phone);
  }
}

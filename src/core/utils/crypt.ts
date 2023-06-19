import * as bcrypt from 'bcrypt';
export function encryptPassword(password: string): string {
  const saltRounds = 10;

  const salt = bcrypt.genSaltSync(saltRounds);
  return bcrypt.hashSync(password, salt);
}

export function comparePassword(
  password: string,
  oldPassword: string,
): boolean {
  return bcrypt.compareSync(password, oldPassword);
}

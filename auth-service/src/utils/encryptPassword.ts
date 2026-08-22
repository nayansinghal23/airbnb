import bcrypt from "bcrypt";

export async function encryptPassword(password: string) {
  const hashedPassword = await bcrypt.hash(password, 12);
  return hashedPassword;
}

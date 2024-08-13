import { Role } from "../enums/Role.enum";
import getModels from "../schemas";

export async function up(): Promise<void> {
  const { UserModel } = await getModels();
  const users = await UserModel.find();
  for (const user of users) {
    if (!user.roles.includes(Role.Member)) user.roles.push(Role.Member);
    await user.save();
  }
}

export async function down(): Promise<void> {}

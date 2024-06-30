import { Role } from "../enums/Role.enum";
import { UserScope } from "../enums/UserScope.enum";
import getModels from "../schemas";

export async function up(): Promise<void> {
  const { UserModel } = await getModels();
  const users = await UserModel.find();
  for (const user of users) {
    if (!user.roles.includes(Role.Member)) user.roles.push(Role.Member);
    if (!user.scopes.includes(UserScope.Default))
      user.scopes.push(UserScope.Default);
    await user.save();
  }
}

export async function down(): Promise<void> {}

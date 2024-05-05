import getModels from "../schemas";

const generateStrongPass = (length: number = 32): string => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};

export async function up(): Promise<void> {
  const { UserModel } = await getModels();

  if ((await UserModel.findOne()) === null) {
    const randomPass = generateStrongPass();
    const admin = new UserModel({
      nickname: "admin",
      email: "admin@local.com",
      password: randomPass,
      roles: ["administrator"],
    });
    await admin.save();
    console.log(`Admin user created with password: ${randomPass}`);
  }
}

export async function down(): Promise<void> {
  const { UserModel } = await getModels();
  await UserModel.deleteOne({ email: "admin@local.com" });
  console.log("Admin user deleted");
}

import getModels from "../schemas";

export async function up(): Promise<void> {
  const { RadioModel } = await getModels();

  const monkey = new RadioModel({
    name: "Monkey Radio",
  });
  await monkey.save();
}

export async function down(): Promise<void> {
  const { RadioModel } = await getModels();

  await RadioModel.deleteMany({ name: "Monkey Radio" });
}

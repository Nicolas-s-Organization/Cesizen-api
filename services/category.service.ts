import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";



export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      articles: true,
    },
  });
};


export const createCategory = async (userId: string, name: string) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      userId,
      name,
    },
  });

  if (existingCategory) {
    throw new AppError(
      "Une catégorie avec ce nom existe déjà",
      "CATEGORY_ALREADY_EXISTS",
      409
    );
  }

  const category = await prisma.category.create({
    data: {
      name,
      userId,
    },
  });

  return category;
};
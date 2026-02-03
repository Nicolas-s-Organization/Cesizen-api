import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";

import { UpdateCategoryInput } from "../schemas/category.schema";



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


export const updateCategory = async (userId: string, categoryId: string, updateData: UpdateCategoryInput
) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category || category.userId !== userId) {
    throw new AppError("Catégorie introuvable ou accès non autorisé", "CATEGORY_NOT_FOUND", 404);
  }

  if (updateData.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        userId,
        name: updateData.name,
        NOT: { id: categoryId },
      },
    });

    if (existingCategory) {
      throw new AppError("Une catégorie avec ce nom existe déjà", "CATEGORY_ALREADY_EXISTS", 409);
    }
  }

  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });

  return updatedCategory;
};

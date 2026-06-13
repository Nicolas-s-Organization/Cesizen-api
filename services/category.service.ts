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
    throw new AppError("Une catégorie avec ce nom existe déjà", "CATEGORY_ALREADY_EXISTS", 409);
  }

  const category = await prisma.category.create({
    data: {
      name,
      userId,
    },
  });

  return category;
};


export const updateCategory = async (categoryId: string, updateData: UpdateCategoryInput) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError("Catégorie introuvable", "CATEGORY_NOT_FOUND", 404);
  }

  if (updateData.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
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


export const deleteCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });

  if (!category) {
    throw new AppError("Catégorie introuvable", "CATEGORY_NOT_FOUND", 404);
  }

  if (category._count.articles > 0) {
    throw new AppError("Impossible de supprimer une catégorie contenant des articles", "CATEGORY_NOT_EMPTY", 400);
  }

  // vérifier que la catégorie a des ressources
  const updatedCategory = await prisma.category.delete({
    where: { id: categoryId },
  });

  return updatedCategory;
};






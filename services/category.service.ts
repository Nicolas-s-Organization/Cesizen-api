import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";



export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      articles: true,
    },
  });
};

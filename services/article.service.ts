import { prisma } from "../lib/prisma";
import { AppError } from "../utils/error";


export const getAllArticles = async () => {
  return prisma.article.findMany({
    include: {
      user: true,
      category : true
    },
  });
};

import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  category: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  prisma: mockPrisma,
}));

import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../../services/category.service';

beforeEach(() => {
  vi.clearAllMocks();
});

describe('getAllCategories', () => {
  it('devrait retourner toutes les catégories avec leurs articles', async () => {
    const mockCategories = [
      { id: '1', name: 'Tech', userId: 'u1', articles: [] },
    ];
    mockPrisma.category.findMany.mockResolvedValue(mockCategories);

    const result = await getAllCategories();

    expect(mockPrisma.category.findMany).toHaveBeenCalledWith({
      include: { articles: true },
    });
    expect(result).toEqual(mockCategories);
  });
});

describe('createCategory', () => {
  it('devrait créer une catégorie avec succès', async () => {
    const mockCategory = { id: '1', name: 'Tech', userId: 'u1' };
    mockPrisma.category.findFirst.mockResolvedValue(null);
    mockPrisma.category.create.mockResolvedValue(mockCategory);

    const result = await createCategory('u1', 'Tech');

    expect(mockPrisma.category.findFirst).toHaveBeenCalledWith({
      where: { userId: 'u1', name: 'Tech' },
    });
    expect(mockPrisma.category.create).toHaveBeenCalledWith({
      data: { name: 'Tech', userId: 'u1' },
    });
    expect(result).toEqual(mockCategory);
  });

  it('devrait rejeter si la catégorie existe déjà', async () => {
    mockPrisma.category.findFirst.mockResolvedValue({ id: '1' });

    await expect(createCategory('u1', 'Tech')).rejects.toThrow(
      'Une catégorie avec ce nom existe déjà'
    );
    expect(mockPrisma.category.create).not.toHaveBeenCalled();
  });
});

describe('updateCategory', () => {
  it('devrait mettre à jour une catégorie avec succès', async () => {
    const updated = { id: '1', name: 'Science', userId: 'u1' };
    mockPrisma.category.findUnique.mockResolvedValue({ id: '1', name: 'Tech', userId: 'u1' });
    mockPrisma.category.findFirst.mockResolvedValue(null);
    mockPrisma.category.update.mockResolvedValue(updated);

    const result = await updateCategory('1', { name: 'Science' });
    expect(result).toEqual(updated);
  });

  it('devrait rejeter si la catégorie est introuvable', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(null);
    await expect(updateCategory('unknown', { name: 'Test' })).rejects.toThrow('Catégorie introuvable');
  });

  it('devrait rejeter si le nouveau nom existe déjà', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.category.findFirst.mockResolvedValue({ id: '2' });
    await expect(updateCategory('1', { name: 'Existant' })).rejects.toThrow('Une catégorie avec ce nom existe déjà');
    expect(mockPrisma.category.update).not.toHaveBeenCalled();
  });
});

describe('deleteCategory', () => {
  it('devrait supprimer une catégorie vide', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({ id: '1', name: 'Tech', _count: { articles: 0 } });
    mockPrisma.category.delete.mockResolvedValue({ id: '1' });

    const result = await deleteCategory('1');
    expect(mockPrisma.category.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(result).toEqual({ id: '1' });
  });

  it('devrait rejeter si la catégorie contient des articles', async () => {
    mockPrisma.category.findUnique.mockResolvedValue({ id: '1', _count: { articles: 3 } });
    await expect(deleteCategory('1')).rejects.toThrow('Impossible de supprimer une catégorie contenant des articles');
    expect(mockPrisma.category.delete).not.toHaveBeenCalled();
  });

  it('devrait rejeter si la catégorie est introuvable', async () => {
    mockPrisma.category.findUnique.mockResolvedValue(null);
    await expect(deleteCategory('unknown')).rejects.toThrow('Catégorie introuvable');
  });
});

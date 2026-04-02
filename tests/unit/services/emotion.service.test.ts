import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  emotion: {
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
  getEmotions,
  getEmotionById,
  createEmotion,
  updateEmotion,
  deleteEmotion,
} from '../../../services/emotion.service';

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── GET EMOTIONS ────────────────────────────────────────
describe('getEmotions', () => {
  it('devrait retourner les émotions de niveau 1 avec leurs enfants', async () => {
    const mockEmotions = [
      { id: '1', name: 'Joie', level: 1, parentId: null, children: [] },
    ];
    mockPrisma.emotion.findMany.mockResolvedValue(mockEmotions);

    const result = await getEmotions();

    expect(mockPrisma.emotion.findMany).toHaveBeenCalledWith({
      where: { parentId: null },
      include: { children: true },
      orderBy: { name: 'asc' },
    });
    expect(result).toEqual(mockEmotions);
  });
});

// ─── GET EMOTION BY ID ──────────────────────────────────
describe('getEmotionById', () => {
  it('devrait retourner une émotion parent avec ses enfants', async () => {
    const mockEmotion = { id: '1', name: 'Joie', level: 1, parentId: null, children: [] };
    mockPrisma.emotion.findFirst.mockResolvedValue(mockEmotion);

    const result = await getEmotionById('1');
    expect(result).toEqual(mockEmotion);
  });

  it('devrait rejeter si l\'émotion parent est introuvable', async () => {
    mockPrisma.emotion.findFirst.mockResolvedValue(null);
    await expect(getEmotionById('unknown')).rejects.toThrow('Emotion parent introuvable');
  });
});

// ─── CREATE EMOTION ─────────────────────────────────────
describe('createEmotion', () => {
  it('devrait créer une émotion de niveau 1 avec succès', async () => {
    const created = { id: '1', name: 'Joie', level: 1, parentId: null, userId: 'u1' };
    mockPrisma.emotion.findFirst.mockResolvedValue(null);
    mockPrisma.emotion.create.mockResolvedValue(created);

    const result = await createEmotion('u1', { name: 'Joie', level: 1 });

    expect(mockPrisma.emotion.create).toHaveBeenCalledWith({
      data: { name: 'Joie', level: 1, parentId: null, userId: 'u1' },
    });
    expect(result).toEqual(created);
  });

  it('devrait créer une émotion de niveau 2 avec un parent valide', async () => {
    const created = { id: '2', name: 'Bonheur', level: 2, parentId: '1', userId: 'u1' };
    mockPrisma.emotion.findUnique.mockResolvedValue({ id: '1' }); // parent existe
    mockPrisma.emotion.findFirst.mockResolvedValue(null); // pas de doublon
    mockPrisma.emotion.create.mockResolvedValue(created);

    const result = await createEmotion('u1', { name: 'Bonheur', level: 2, parentId: '1' });
    expect(result).toEqual(created);
  });

  it('devrait rejeter si le parent n\'existe pas pour niveau 2', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue(null);

    await expect(
      createEmotion('u1', { name: 'Bonheur', level: 2, parentId: 'fake' })
    ).rejects.toThrow("L'émotion parent n'existe pas");
    expect(mockPrisma.emotion.create).not.toHaveBeenCalled();
  });

  it('devrait rejeter si une émotion niveau 1 a un parentId', async () => {
    await expect(
      createEmotion('u1', { name: 'Joie', level: 1, parentId: '1' })
    ).rejects.toThrow('Une émotion de niveau 1 ne peut pas avoir de parent');
    expect(mockPrisma.emotion.create).not.toHaveBeenCalled();
  });

  it('devrait rejeter si le nom existe déjà', async () => {
    mockPrisma.emotion.findFirst.mockResolvedValue({ id: '1' });

    await expect(
      createEmotion('u1', { name: 'Joie', level: 1 })
    ).rejects.toThrow('Une emotion avec ce nom existe déjà');
    expect(mockPrisma.emotion.create).not.toHaveBeenCalled();
  });
});

// ─── UPDATE EMOTION ─────────────────────────────────────
describe('updateEmotion', () => {
  it('devrait mettre à jour une émotion avec succès', async () => {
    const updated = { id: '1', name: 'Tristesse' };
    mockPrisma.emotion.findUnique.mockResolvedValue({ id: '1', name: 'Joie' });
    mockPrisma.emotion.findFirst.mockResolvedValue(null);
    mockPrisma.emotion.update.mockResolvedValue(updated);

    const result = await updateEmotion('1', { name: 'Tristesse' });
    expect(result).toEqual(updated);
  });

  it('devrait rejeter si l\'émotion est introuvable', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue(null);
    await expect(updateEmotion('unknown', { name: 'Test' })).rejects.toThrow('Émotion introuvable');
  });

  it('devrait rejeter si le nouveau nom existe déjà', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.emotion.findFirst.mockResolvedValue({ id: '2' });

    await expect(updateEmotion('1', { name: 'Existant' })).rejects.toThrow('Une autre emotion avec ce nom existe déjà');
    expect(mockPrisma.emotion.update).not.toHaveBeenCalled();
  });
});

// ─── DELETE EMOTION ─────────────────────────────────────
describe('deleteEmotion', () => {
  it('devrait supprimer une émotion sans enfants', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue({ id: '1', level: 1, children: [] });
    mockPrisma.emotion.delete.mockResolvedValue({ id: '1' });

    await deleteEmotion('1');
    expect(mockPrisma.emotion.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('devrait supprimer une émotion de niveau 2', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue({ id: '2', level: 2, children: [] });
    mockPrisma.emotion.delete.mockResolvedValue({ id: '2' });

    await deleteEmotion('2');
    expect(mockPrisma.emotion.delete).toHaveBeenCalledWith({ where: { id: '2' } });
  });

  it('devrait rejeter si l\'émotion est introuvable', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue(null);
    await expect(deleteEmotion('unknown')).rejects.toThrow('Émotion introuvable');
  });

  it('devrait rejeter si l\'émotion niveau 1 a des enfants', async () => {
    mockPrisma.emotion.findUnique.mockResolvedValue({
      id: '1', level: 1, children: [{ id: '2' }],
    });

    await expect(deleteEmotion('1')).rejects.toThrow('Impossible de supprimer une émotion de niveau 1 qui a des sous-émotions');
    expect(mockPrisma.emotion.delete).not.toHaveBeenCalled();
  });
});

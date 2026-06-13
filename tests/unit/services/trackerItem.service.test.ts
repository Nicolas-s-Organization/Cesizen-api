import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  trackerItem: {
    findMany: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  emotion: {
    findFirst: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  prisma: mockPrisma,
}));

import {
  getTrackerItems,
  getTrackerItemById,
  createTrackerItem,
  updateTrackerItem,
  deleteTrackerItem,
  getReports,
} from '../../../services/trackerItem.service';

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── GET TRACKER ITEMS ──────────────────────────────────
describe('getTrackerItems', () => {
  it('devrait retourner les tracker items d\'un utilisateur', async () => {
    const items = [{ id: '1', userId: 'u1', emotion: {} }];
    mockPrisma.trackerItem.findMany.mockResolvedValue(items);

    const result = await getTrackerItems('u1');

    expect(mockPrisma.trackerItem.findMany).toHaveBeenCalledWith({
      where: { userId: 'u1' },
      include: { emotion: true },
      orderBy: { createdAt: 'desc' },
    });
    expect(result).toEqual(items);
  });
});

// ─── GET TRACKER ITEM BY ID ────────────────────────────
describe('getTrackerItemById', () => {
  it('devrait retourner un tracker item', async () => {
    const item = { id: '1', emotion: {} };
    mockPrisma.trackerItem.findFirst.mockResolvedValue(item);

    const result = await getTrackerItemById('1');
    expect(result).toEqual(item);
  });

  it('devrait rejeter si introuvable', async () => {
    mockPrisma.trackerItem.findFirst.mockResolvedValue(null);
    await expect(getTrackerItemById('unknown')).rejects.toThrow('Tracker Item introuvable');
  });
});

// ─── CREATE TRACKER ITEM ────────────────────────────────
describe('createTrackerItem', () => {
  it('devrait créer un tracker item avec succès', async () => {
    const emotion = { id: 'e1', level: 2 };
    const created = { id: '1', userId: 'u1', emotionId: 'e1', intensity: 3, comment: 'test' };

    mockPrisma.emotion.findFirst.mockResolvedValue(emotion);
    mockPrisma.trackerItem.create.mockResolvedValue(created);

    const result = await createTrackerItem('u1', { emotionId: 'e1', intensity: 3, comment: 'test' });

    expect(mockPrisma.trackerItem.create).toHaveBeenCalledWith({
      data: { userId: 'u1', emotionId: 'e1', intensity: 3, comment: 'test' },
    });
    expect(result).toEqual(created);
  });

  it('devrait rejeter si l\'émotion est introuvable', async () => {
    mockPrisma.emotion.findFirst.mockResolvedValue(null);
    await expect(createTrackerItem('u1', { emotionId: 'bad', intensity: 3 })).rejects.toThrow('Émotion introuvable');
  });

  it('devrait rejeter si l\'émotion n\'est pas de niveau 2', async () => {
    mockPrisma.emotion.findFirst.mockResolvedValue({ id: 'e1', level: 1 });
    await expect(createTrackerItem('u1', { emotionId: 'e1', intensity: 3 })).rejects.toThrow('Vous devez sélectionner une émotion de niveau 2');
  });
});

// ─── UPDATE TRACKER ITEM ────────────────────────────────
describe('updateTrackerItem', () => {
  it('devrait mettre à jour avec succès', async () => {
    const existing = { id: '1', userId: 'u1' };
    const updated = { id: '1', intensity: 5, comment: 'updated' };

    mockPrisma.trackerItem.findUnique.mockResolvedValue(existing);
    mockPrisma.trackerItem.update.mockResolvedValue(updated);

    const result = await updateTrackerItem('u1', '1', { intensity: 5, comment: 'updated' });
    expect(result).toEqual(updated);
  });

  it('devrait rejeter si introuvable', async () => {
    mockPrisma.trackerItem.findUnique.mockResolvedValue(null);
    await expect(updateTrackerItem('u1', 'bad', { intensity: 3 })).rejects.toThrow('tracker item introuvable');
  });

  it('devrait rejeter si le tracker ne lui appartient pas', async () => {
    mockPrisma.trackerItem.findUnique.mockResolvedValue({ id: '1', userId: 'other' });
    await expect(updateTrackerItem('u1', '1', { intensity: 3 })).rejects.toThrow('Ce tracker ne vous appartient pas');
    expect(mockPrisma.trackerItem.update).not.toHaveBeenCalled();
  });
});

// ─── DELETE TRACKER ITEM ────────────────────────────────
describe('deleteTrackerItem', () => {
  it('devrait supprimer avec succès', async () => {
    mockPrisma.trackerItem.findUnique.mockResolvedValue({ id: '1', userId: 'u1' });
    mockPrisma.trackerItem.delete.mockResolvedValue({ id: '1' });

    await deleteTrackerItem('u1', '1');
    expect(mockPrisma.trackerItem.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('devrait rejeter si introuvable', async () => {
    mockPrisma.trackerItem.findUnique.mockResolvedValue(null);
    await expect(deleteTrackerItem('u1', 'bad')).rejects.toThrow('tracker item introuvable');
  });

  it('devrait rejeter si le tracker ne lui appartient pas', async () => {
    mockPrisma.trackerItem.findUnique.mockResolvedValue({ id: '1', userId: 'other' });
    await expect(deleteTrackerItem('u1', '1')).rejects.toThrow('Ce tracker ne vous appartient pas');
    expect(mockPrisma.trackerItem.delete).not.toHaveBeenCalled();
  });
});

// ─── GET REPORTS ────────────────────────────────────────
describe('getReports', () => {
  it('devrait rejeter si période invalide', async () => {
    await expect(getReports('u1', 'invalid')).rejects.toThrow('Période invalide');
  });

  it('devrait retourner un rapport vide si aucune entrée', async () => {
    mockPrisma.trackerItem.findMany.mockResolvedValue([]);

    const result = await getReports('u1', 'month');

    expect(result.totalEntries).toBe(0);
    expect(result.averageIntensity).toBe(0);
    expect(result.mostFrequentEmotion).toBeNull();
    expect(result.period).toBe('month');
  });

  it('devrait calculer les statistiques correctement', async () => {
    const now = new Date();
    const items = [
      {
        id: '1', intensity: 4, createdAt: now,
        emotion: { id: 'e1', name: 'Content', parent: { id: 'p1', name: 'Joie' } },
      },
      {
        id: '2', intensity: 6, createdAt: now,
        emotion: { id: 'e2', name: 'Heureux', parent: { id: 'p1', name: 'Joie' } },
      },
      {
        id: '3', intensity: 8, createdAt: now,
        emotion: { id: 'e3', name: 'Triste', parent: { id: 'p2', name: 'Tristesse' } },
      },
    ];

    mockPrisma.trackerItem.findMany.mockResolvedValue(items);

    const result = await getReports('u1', 'week');

    expect(result.totalEntries).toBe(3);
    expect(result.averageIntensity).toBe(6);
    expect(result.mostFrequentEmotion?.name).toBe('Joie');
    expect(result.distribution).toHaveLength(2);
    expect(result.averageIntensityByEmotion).toHaveLength(2);
    expect(result.intensityOverTime.length).toBeGreaterThan(0);
  });

  it('devrait accepter les périodes week, month, quarter, year', async () => {
    mockPrisma.trackerItem.findMany.mockResolvedValue([]);

    for (const period of ['week', 'month', 'quarter', 'year']) {
      const result = await getReports('u1', period);
      expect(result.period).toBe(period);
    }
  });
});

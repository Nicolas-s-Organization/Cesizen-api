import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockPrisma = vi.hoisted(() => ({
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('../../../lib/prisma', () => ({
  prisma: mockPrisma,
}));

import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../../../services/user.service';

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── GET ALL USERS ──────────────────────────────────────
describe('getAllUsers', () => {
  it('devrait retourner les utilisateurs paginés', async () => {
    const users = [{ id: '1', email: 'a@a.com' }];
    mockPrisma.user.findMany.mockResolvedValue(users);
    mockPrisma.user.count.mockResolvedValue(1);

    const result = await getAllUsers({ page: 1, limit: 10 });

    expect(result.data).toEqual(users);
    expect(result.meta).toEqual({ total: 1, page: 1, limit: 10, totalPages: 1 });
  });

  it('devrait appliquer le skip correct pour la page 2', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(0);

    await getAllUsers({ page: 2, limit: 5 });

    expect(mockPrisma.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 5, take: 5 })
    );
  });

  it('devrait filtrer par recherche', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(0);

    await getAllUsers({ search: 'john' });

    const call = mockPrisma.user.findMany.mock.calls[0][0];
    expect(call.where.OR).toBeDefined();
    expect(call.where.OR).toHaveLength(3);
  });

  it('devrait filtrer par rôle', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(0);

    await getAllUsers({ role: 'ADMIN' });

    const call = mockPrisma.user.findMany.mock.calls[0][0];
    expect(call.where.role).toBe('ADMIN');
  });

  it('devrait filtrer par isActive', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(0);

    await getAllUsers({ isActive: true });

    const call = mockPrisma.user.findMany.mock.calls[0][0];
    expect(call.where.isActive).toBe(true);
  });

  it('devrait utiliser les valeurs par défaut page=1 limit=10', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(0);

    const result = await getAllUsers({});

    expect(result.meta.page).toBe(1);
    expect(result.meta.limit).toBe(10);
  });

  it('devrait calculer totalPages correctement', async () => {
    mockPrisma.user.findMany.mockResolvedValue([]);
    mockPrisma.user.count.mockResolvedValue(23);

    const result = await getAllUsers({ page: 1, limit: 10 });
    expect(result.meta.totalPages).toBe(3);
  });
});

// ─── GET USER BY ID ─────────────────────────────────────
describe('getUserById', () => {
  it('devrait retourner un utilisateur', async () => {
    const user = { id: '1', email: 'a@a.com' };
    mockPrisma.user.findUnique.mockResolvedValue(user);

    const result = await getUserById('1');
    expect(result).toEqual(user);
  });

  it('devrait rejeter si introuvable', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(getUserById('bad')).rejects.toThrow('Utilisateur introuvable');
  });
});

// ─── UPDATE USER ────────────────────────────────────────
describe('updateUser', () => {
  it('devrait mettre à jour avec succès', async () => {
    const existing = { id: '1', email: 'old@a.com' };
    const updated = { id: '1', email: 'old@a.com', firstname: 'New' };

    mockPrisma.user.findUnique.mockResolvedValue(existing);
    mockPrisma.user.update.mockResolvedValue(updated);

    const result = await updateUser('1', { firstname: 'New' });
    expect(result).toEqual(updated);
  });

  it('devrait rejeter si utilisateur introuvable', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(updateUser('bad', { firstname: 'X' })).rejects.toThrow('Utilisateur introuvable');
  });

  it('devrait rejeter si email déjà pris par un autre', async () => {
    const existing = { id: '1', email: 'old@a.com' };
    mockPrisma.user.findUnique
      .mockResolvedValueOnce(existing)      // findUnique pour vérifier existence
      .mockResolvedValueOnce({ id: '2' });  // findUnique pour vérifier email

    await expect(updateUser('1', { email: 'taken@a.com' })).rejects.toThrow('Cet email est déjà utilisé');
    expect(mockPrisma.user.update).not.toHaveBeenCalled();
  });

  it('devrait permettre de garder le même email', async () => {
    const existing = { id: '1', email: 'same@a.com' };
    const updated = { id: '1', email: 'same@a.com' };

    mockPrisma.user.findUnique.mockResolvedValue(existing);
    mockPrisma.user.update.mockResolvedValue(updated);

    const result = await updateUser('1', { email: 'same@a.com' });
    expect(result).toEqual(updated);
    // findUnique appelé une seule fois (pas de vérif email)
    expect(mockPrisma.user.findUnique).toHaveBeenCalledTimes(1);
  });
});

// ─── DELETE USER ────────────────────────────────────────
describe('deleteUser', () => {
  it('devrait supprimer avec succès', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: '1' });
    mockPrisma.user.delete.mockResolvedValue({ id: '1' });

    await deleteUser('1');
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });

  it('devrait rejeter si introuvable', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    await expect(deleteUser('bad')).rejects.toThrow('Utilisateur introuvable');
  });
});

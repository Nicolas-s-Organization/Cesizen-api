// Seed idempotent : tous les enregistrements ont un UUID fixe et sont créés via upsert.
// → s'exécute à chaque démarrage container, mais devient un no-op une fois les données présentes.
// → si on wipe le volume Postgres, le seed se réapplique automatiquement au prochain start.
import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { UserRole, ArticleStatus } from "../generated/prisma/enums";

const adapter = new PrismaPg({ connectionString: `${process.env.DATABASE_URL}` });
const prisma = new PrismaClient({ adapter });

// UUIDs fixes — préfixe lisible pour distinguer les types d'entités seedées.
const ID = {
  adminUser: "10000000-0000-0000-0000-000000000001",
  demoUser:  "10000000-0000-0000-0000-000000000002",
  catStress:    "20000000-0000-0000-0000-000000000001",
  catSommeil:   "20000000-0000-0000-0000-000000000002",
  catRelations: "20000000-0000-0000-0000-000000000003",
  catEmotions:  "20000000-0000-0000-0000-000000000004",
  art1: "30000000-0000-0000-0000-000000000001",
  art2: "30000000-0000-0000-0000-000000000002",
  art3: "30000000-0000-0000-0000-000000000003",
  art4: "30000000-0000-0000-0000-000000000004",
  art5: "30000000-0000-0000-0000-000000000005",
  art6: "30000000-0000-0000-0000-000000000006",
} as const;

async function main() {
  console.log("[seed] start");

  // ─── Users ───────────────────────────────────────────────────────────────
  // Upsert par email (unique) — si un user de même email existe déjà, on ne touche à rien.
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cesizen.demo" },
    update: {},
    create: {
      id: ID.adminUser,
      email: "admin@cesizen.demo",
      password: adminPassword,
      firstname: "Admin",
      lastname: "Démo",
      birthdate: new Date("1990-01-01"),
      description: "Compte administrateur de démonstration",
      role: UserRole.ADMIN,
      isActive: true,
    },
  });

  const userPassword = await bcrypt.hash("User123!", 10);
  await prisma.user.upsert({
    where: { email: "user@cesizen.demo" },
    update: {},
    create: {
      id: ID.demoUser,
      email: "user@cesizen.demo",
      password: userPassword,
      firstname: "Utilisateur",
      lastname: "Démo",
      birthdate: new Date("1995-06-15"),
      description: "Compte utilisateur de démonstration",
      role: UserRole.USER,
      isActive: true,
    },
  });

  // ─── Catégories ──────────────────────────────────────────────────────────
  // Toutes rattachées à l'admin (créateur).
  const categories = [
    { id: ID.catStress,    name: "Stress" },
    { id: ID.catSommeil,   name: "Sommeil" },
    { id: ID.catRelations, name: "Relations" },
    { id: ID.catEmotions,  name: "Émotions" },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: {},
      create: { id: cat.id, name: cat.name, userId: admin.id },
    });
  }

  // ─── Articles publiés ────────────────────────────────────────────────────
  // Auteur : admin. Statut : PUBLISHED pour être visibles en front.
  const articles = [
    {
      id: ID.art1,
      categoryId: ID.catStress,
      title: "Comprendre le stress au quotidien",
      content: "Le stress est une réaction naturelle de l'organisme face à une situation perçue comme une menace ou un défi. Apprendre à reconnaître ses signaux est la première étape pour mieux le gérer.",
    },
    {
      id: ID.art2,
      categoryId: ID.catStress,
      title: "5 techniques de respiration anti-stress",
      content: "La cohérence cardiaque, la respiration abdominale, la respiration carrée... Découvrez les techniques de respiration les plus efficaces pour calmer le système nerveux en quelques minutes.",
    },
    {
      id: ID.art3,
      categoryId: ID.catSommeil,
      title: "Améliorer la qualité de son sommeil",
      content: "Un sommeil de qualité repose sur des habitudes simples : horaires réguliers, écrans éloignés en soirée, chambre fraîche et obscure. Le sommeil est un pilier central de la santé mentale.",
    },
    {
      id: ID.art4,
      categoryId: ID.catRelations,
      title: "Communiquer ses émotions à ses proches",
      content: "Exprimer ce que l'on ressent renforce les liens et prévient les malentendus. Les outils de la communication non-violente offrent un cadre précieux pour partager ses émotions sans heurter l'autre.",
    },
    {
      id: ID.art5,
      categoryId: ID.catEmotions,
      title: "Identifier et nommer ses émotions",
      content: "Mettre des mots précis sur ce que l'on ressent — joie, tristesse, colère, peur, surprise, dégoût — aide à mieux les réguler. C'est la base de la conscience émotionnelle.",
    },
    {
      id: ID.art6,
      categoryId: ID.catEmotions,
      title: "L'auto-compassion comme outil de résilience",
      content: "Se traiter avec la bienveillance que l'on offrirait à un ami est une compétence qui s'apprend. Elle réduit l'auto-critique et renforce la capacité à rebondir face aux difficultés.",
    },
  ];
  for (const art of articles) {
    await prisma.article.upsert({
      where: { id: art.id },
      update: {},
      create: {
        id: art.id,
        title: art.title,
        content: art.content,
        status: ArticleStatus.PUBLISHED,
        userId: admin.id,
        categoryId: art.categoryId,
      },
    });
  }

  console.log("[seed] done — 2 users, 4 categories, 6 articles");
}

main()
  .catch((e) => {
    console.error("[seed] failed", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

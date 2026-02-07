import multer from "multer";
import path from "path";
import fs from "fs";

// Dossier où stocker les images
const uploadDir = path.join(__dirname, "../../uploads/articles");

// Créer le dossier s’il n’existe pas
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration stockage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },

    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now().toString() + ext; 
        cb(null, uniqueName);
    },
});

// Filtrer les fichiers acceptés
const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    }
    else {
        cb(new Error("Seules les images sont autorisées"));
    }
};

export const uploadArticleImage = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // max 2MB
    },
});

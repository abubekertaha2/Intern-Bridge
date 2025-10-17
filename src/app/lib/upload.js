import path from 'path';
import fs from 'fs';

export const uploadDir = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

export const cleanupFile = (fileName) => {
    if (fileName) {
        const filePath = path.join(uploadDir, fileName);
        fs.unlink(filePath, (err) => {
            if (err) console.error("Error deleting failed upload file:", err);
        });
    }
};
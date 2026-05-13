

import multer from 'multer';
import path from 'path';

import Crypto from 'crypto';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

export default {
    // dest: Path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    storage: multer.diskStorage({
        destination: (req,file, cb) => {

            cb(null, path.resolve(__dirname,"..",'..',"..",'tmp', 'uploads'));
        },
        filename: (req, file, cb) => {
            Crypto.randomBytes(16, (err, hash) => {
                if (err) { cb(err);console.log(err) };
                file.key = `${hash.toString('hex')}-${file.originalname}`;
                cb(null, file.key);
            });
        },
    }),
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024 * 1024
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'image/jpg',
            'image/svg',
            'image/webp'
            

        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('invalid file type.'));
        }
    }
}
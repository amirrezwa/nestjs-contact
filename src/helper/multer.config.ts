import { diskStorage } from "multer";
import { extname } from "path";

export const multerOptions = {
  storage: diskStorage({
    destination: './uploads',  // مسیر ذخیره فایل‌ها
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/image\/*/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // محدودیت سایز فایل به 10MB
};

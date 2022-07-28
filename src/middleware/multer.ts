import multer from "multer";
import mime from "mime";
import {randomUUID} from "node:crypto";

export const generatePhotoFilename = (mimeType: string) => {
  const randomFilename = `${randomUUID()}-${Date.now()}`;
  const fileExtension = mime.getExtension(mimeType);
  const fileName = `${randomFilename}.${fileExtension}`;
  return fileName;
}

const storage = multer.diskStorage({
  destination: "photos/uploads/",
  filename: (request, file, callback) => {
    return callback(null, generatePhotoFilename(file.mimetype));
  }
});

const MAX_SIZE_IN_MEGABYTES: number = 6 * 1024 * 1024;
const VALID_MIME_TYPES: string[] = ["image/png", "image/jpeg"];
const fileFilter: multer.Options["fileFilter"] = (request, file, callback) => {
  if(VALID_MIME_TYPES.includes(file.mimetype)) callback(null, true);
  else callback(new Error("Error: The uploaded file must be a JPG or a PNG image"));
};
export const multerOptions = {
  fileFilter,
  limits: {
    fileSize: MAX_SIZE_IN_MEGABYTES
  }
};

export const initMulterMiddleware = () => {
  return multer({storage, ...multerOptions});
};
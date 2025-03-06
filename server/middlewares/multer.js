import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        // console.log("File---", file)
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

export const upload = multer({ storage });
  
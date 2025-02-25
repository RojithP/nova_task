import multer from "multer";
import path from "path";


const _diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve("storage"))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})


const multerConfig = multer({ storage: _diskStorage })


export default multerConfig
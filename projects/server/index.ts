import express from "express";
import { LoginController, SignUpController, tokenValidatonController } from "./controller/auth";
import dotenv from "dotenv";
import tokenVerification from "./middleware/tokenVerification";
import { chatHistoryController } from "./controller/chatHistory";
import multerConfig from "./helper/multer";
import cors from "cors";
dotenv.config({ path: "./.env" })


const app = express();
const PORT = process.env.PORT;


app.use(cors())
app.use(express.json())
app.post("/login", LoginController)
app.post("/signup", SignUpController)
app.post("/chathistory", tokenVerification, multerConfig.single("chat_history"), chatHistoryController);
app.get("/validatetoken", tokenVerification, tokenValidatonController)

app.use("*", (req, res) => { res.status(404).json({ message: "not found!" }) })

app.listen(PORT, function () {
    console.log("Listening on PORT :" + PORT)
})
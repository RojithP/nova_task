import type { Request, Response } from "express";
import { sign } from "jsonwebtoken";
import prisma from "../helper/prisma";
import { createHash } from "crypto";
import { CustomRequest } from "./chatHistory";

export const LoginController = async function (req: Request, res: Response) {
    try {
        const { email_id, password } = req.body;
        let message: String = "";
        let status: Number = 200;

        if (!email_id) {
            message = "Required Email";
            status = 400
        }
        if (!password) {
            status = 400;
            message = "Required Password";
        }

        let getUser = await prisma.user.findFirst({
            select: {
                first_name: true,
                last_name: true,
                email_id: true,
                password: true,
                id: true
            },
            where: {
                email_id
            }
        })
        if (getUser) {
            const createHashPassword = createHash("md5").update(password).digest("hex");
            if (createHashPassword != getUser.password) {
                status = 400;
                message = "Invalid Username/Password"
            }
        } else {
            status = 400;
            message = "User Not Found!";
        }
        if (status == 200) {
            const secret = process.env.SECRET;
            const createToken = sign({ email_id: getUser.email_id, id: getUser.id, first_name: getUser.first_name, last_name: getUser.last_name }, secret, { expiresIn: "30d" })
            res.status(200).json({
                message: "Logged in!",
                data: {
                    ...getUser,
                    token: createToken
                }
            })
        } else {
            res.status(400).json({ message })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
};



export const SignUpController = async function (req: Request, res: Response) {
    try {
        const { first_name, last_name, email_id, new_password, confirm_password } = req.body;
        let message: String = "";
        let status: Number = 200;

        if (!first_name) {
            message = "Required First Name";
            status = 400
        }
        if (!last_name) {
            message = "Required Last Name"
            status = 400
        }
        if (!email_id) {
            message = "Requried Email"
            status = 400
        }
        if (!new_password || new_password.listen < 8) {
            message = "Invalid Password"
            status = 400
        }
        if (new_password != confirm_password) {
            message = "Password did not match";
            status = 400
        }
        let checkUser = await prisma.user.findFirst({
            select: {
                id: true
            },
            where: {
                email_id
            }
        })
        if (checkUser) {
            message = "User Already Exists!.please try to use different account";
            status = 400
        }
        if (status == 200) {
            const createHashPassword = createHash("md5").update(new_password).digest("hex")
            let createUser = await prisma.user.create({
                data: {
                    first_name,
                    last_name,
                    email_id,
                    password: createHashPassword
                }
            })
            res.status(201).json({ message: "User Created!" })
        } else {
            res.status(400).json({ message })
        }

    } catch (error: any) {
        res.status(500).json({ message: error?.message })
    }
}


export const tokenValidatonController = async function (req: CustomRequest, res: Response) {
    try {
        res.status(200).json({ data: req.token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}
import type { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import ExcelJS from "exceljs";
import prisma from "../helper/prisma";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const chatHistoryController = async function (req: CustomRequest, res: Response) {
    try {
        if (!req.file) {
            res.status(400).json({ message: "No file uploaded" });
        } else {
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile(req.file.path);
            const worksheet = workbook.worksheets[0];
            let rowsData: any[] = [];
            worksheet.eachRow((row, rowNumber) => {
                let rowData = (row.values as Array<any>).slice(1);
                rowsData.push(rowData);
            });
            let createChatHistory = await prisma.chat_history.createMany({
                data: rowsData.slice(1, rowsData.length).map((e) => {
                    return {
                        message: e[0],
                        time_stamp: `${e[1]}`,
                        // @ts-ignore
                        user_id:req.token.id
                    }
                })
            })
            res.json({
                message: "Excel file processed successfully",
            });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}


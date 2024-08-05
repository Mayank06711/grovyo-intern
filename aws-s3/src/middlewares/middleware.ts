import {Request ,Response, NextFunction } from "express";
import multer from "multer"
import { ApiError } from "../utils/apiError";


class middleware {
    
    // Multer middleware method for single and multiple files
    private static multerUpload = multer({
        limits: {
          fileSize: 1024 * 1024 * 5, // 5mb
        },
    }); //  by default it will use our ram memory  to store files in buffer format  as we have not provided any location to store files
    
    private static singleFile = middleware.multerUpload.array("avatar", 1)
    private static attachmentsMulter = middleware.multerUpload.array("files", 5)
    
    private static getBase64 = (file:any) =>`data:${file[0].mimetype};base64,${file[0].buffer.toString("base64")}`

    private static errorMiddleware(err:any, req:Request, res:Response, next:NextFunction) {
        err.message ||= "Internal Server Error, please try again later"
        const statusCode = err.statusCode || 500

        console.error(`Error: ${err}`); // apierror
        res.status(statusCode).json({ 
            sucess:false,
            message:err.message
            // message: process.env.NODE_ENV.trim() === "DEVELOPMENT" ? err: err.message // here i will use apiError class  
        }); 
    }

    // Expose the private methods as static methods wrapped in AsyncHandler so that erros can be catched
    static SingleFile = middleware.singleFile;
    static AttachmentsMulter = middleware.attachmentsMulter;
    static ErrorMiddleware = middleware.errorMiddleware;
}

export  {middleware}
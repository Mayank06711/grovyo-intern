import express from "express";
import { AWSAPI } from "../controllers/aws-controllers";
import { middleware } from "../middlewares/middleware";

const router = express.Router();

router.get('/upload', AWSAPI.upload);
router.post('/generatePresignedUrl', AWSAPI.generatePresignedURL);
router.post('/uploadFiles', middleware.AttachmentsMulter, AWSAPI.uploadFile);

export default router;

import express, { Request, Response } from "express";
import { AWS_SERVICES } from "../helper/AWS";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";

interface GeneratePresignedUrlQuery {
  fileName: string;
  contentType: string;
}

// Request<{}, {}, {}, GeneratePresignedUrlQuery>
class AWSAPI {
  private static async uploadData(req: Request, res: Response) {
    res.send(`

        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upload File to XYZ-COMPANY S3 Bucket</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .upload-container {
      height: 85%;
      width: 85%;
      max-width: 800px;
      padding: 20px;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .upload-container h2 {
      color: #333;
      margin-top: 0;
    }
    .upload-form {
      margin-top:5%;
      display: flex;
      align-items: center;
      width: 100%;
      justify-content: center;
    }
    #fileInput {
      padding: 10px;
      margin-right: 20px;
      width: 300px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
    }
    #filePreview {
      margin-top:5%;
      max-width: 100%;
      height: auto;
      margin-top: 20px;
      overflow: hidden;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 20px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
    }
    button:hover {
      background-color: #45a049;
    }
  </style>
</head>
<body>
  <div class="upload-container">
    <h2>Upload File to XYZ-COMPANY S3 Bucket</h2>
    <form class="upload-form" id="uploadForm">
      <input type="file" id="fileInput" required onchange="previewFile()">
      <button type="button" onclick="handleUpload()">Upload</button>
    </form>
    <div id="filePreview"></div>
  </div>

  <script>
    function previewFile() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];
      const filePreview = document.getElementById('filePreview');

      if (file) {
        filePreview.innerHTML = ''; // Clear previous preview

        // Display different previews based on file type
        if (file.type.startsWith('image/')) {
          // Image preview
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          filePreview.appendChild(img);
        } else if (file.type === 'application/pdf') {
          // PDF preview (can be an embedded viewer or link)
          const pdfEmbed = document.createElement('embed');
          pdfEmbed.src = URL.createObjectURL(file);
          pdfEmbed.type = 'application/pdf';
          pdfEmbed.width = '600px';
          pdfEmbed.height = '800px'; // Adjust height as needed
          filePreview.appendChild(pdfEmbed);
        } else if (file.type.startsWith('video/')) {
          // Video preview (can be an embedded player or link)
          const videoPlayer = document.createElement('video');
          videoPlayer.src = URL.createObjectURL(file);
          videoPlayer.controls = true;
          videoPlayer.style.maxWidth = '100%';
          videoPlayer.style.height = 'auto';
          filePreview.appendChild(videoPlayer);
        } else {
          // Default message for unsupported file types
          const unsupportedMessage = document.createElement('p');
          unsupportedMessage.textContent = "File type is not supported for preview.";
          filePreview.appendChild(unsupportedMessage);
        }
      } else {
        filePreview.innerHTML = ''; // Clear preview if no file selected
      }
    }

    async function handleUpload() {
      const fileInput = document.getElementById('fileInput');
      const file = fileInput.files[0];

      if (!file) {
        alert('Please select a file');
        return;
      }

      const fileName = file.name;
      const contentType = file.type;

      try {
        // Call a backend endpoint to generate presigned URL
        const response = await fetch('/api/v1/xyz-company/generatePresignedUrl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ fileName, contentType })
        });

        if (!response.ok) {
          throw new Error('Failed to generate presigned URL');
        }

        const { presignedUrl } = await response.json();
        console.log('Presigned URL:', presignedUrl);

        // Upload the file using the presigned URL
        const uploadResponse = await fetch(presignedUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': contentType
          },
          body: file
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload file');
        }

        alert('File uploaded successfully');
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      }
    }
  </script>
</body>
</html>



        `);
  }

  private static async generatePresignedUrl(req: Request, res: Response) {
    try {
      console.log(req);
      const { fileName, contentType } = req.body;
      console.log(fileName, contentType);
     if (!fileName || !contentType) {
      throw new Error("Invalid file or content type");
    }

      // Generate presigned URL
      const preSignedUrl = await AWS_SERVICES.putObjectToS3(
        process.env.AWS_BUCKET_NAME!,
        fileName,
        contentType,
        3600
      );
      if (!preSignedUrl) {
        throw new Error("Failed to generate presigned URL");
      }
      console.log(preSignedUrl, "preSigned");
      // Send the presigned URL back to the client
      res.status(200).json({ presignedUrl: preSignedUrl });
    } catch (error) {
      console.error("Error generating presigned URL:", error);
      res.status(500).json({ error: "Failed to generate presigned URL" });
    }
  }
  static upload = AWSAPI.uploadData;
  static generatePresignedURL = AWSAPI.generatePresignedUrl;
}

export { AWSAPI };












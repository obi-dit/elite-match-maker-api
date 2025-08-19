# Cloudinary Integration Setup

## Overview

This application uses Cloudinary for image and video uploads. Cloudinary provides cloud-based image and video management services.

## Setup Instructions

### 1. Create a Cloudinary Account

1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up for a free account
3. Get your credentials from the dashboard

### 2. Environment Variables

Add the following environment variables to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

### 3. Install Dependencies

```bash
npm install cloudinary multer @types/multer
```

## API Endpoints

### Upload Image

- **POST** `/upload/image`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (image file)
- **Response**:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "message": "Image uploaded successfully"
}
```

### Upload Video

- **POST** `/upload/video`
- **Content-Type**: `multipart/form-data`
- **Body**: `file` (video file)
- **Response**:

```json
{
  "success": true,
  "url": "https://res.cloudinary.com/...",
  "message": "Video uploaded successfully"
}
```

## File Limits

- **Images**: 10MB max, formats: jpg, jpeg, png, gif, webp
- **Videos**: 100MB max, formats: mp4, avi, mov, wmv, flv, webm

## Features

- Automatic image optimization (800x800 max, auto quality)
- Video optimization (1280x720 max, auto quality)
- Secure HTTPS URLs
- Organized folder structure (`elite-match-maker/` for images, `elite-match-maker/videos/` for videos)

## Frontend Integration

The frontend includes a `FileUpload` component that handles:

- Multiple file uploads
- Progress indicators
- Error handling
- File type validation
- Automatic URL storage

## Security Notes

- Files are validated on both client and server
- File size limits are enforced
- Only specific file types are allowed
- URLs are stored securely in the database

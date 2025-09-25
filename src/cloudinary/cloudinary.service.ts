import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { FileDirectory } from 'src/enums/general';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      // Convert buffer to base64
      const base64Image = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Image}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'elite-match-maker',
        resource_type: 'auto',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto' },
        ],
      });

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw new Error('Failed to upload image to Cloudinary');
    }
  }

  async uploadVideo(
    file: Express.Multer.File,
    folder: FileDirectory = FileDirectory.MAIN,
  ): Promise<string> {
    try {
      // Convert buffer to base64
      const base64Video = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Video}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder,
        resource_type: 'video',
        transformation: [
          { width: 1280, height: 720, crop: 'limit' },
          { quality: 'auto' },
        ],
        chunk_size: 6000000, // 6MB chunks for large videos
        eager: [
          { width: 1280, height: 720, crop: 'limit' },
          { width: 640, height: 360, crop: 'limit' },
        ],
      });

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary video upload error:', error);
      throw new Error('Failed to upload video to Cloudinary');
    }
  }

  async uploadAudio(
    file: Express.Multer.File,
    folder: FileDirectory = FileDirectory.AUDIO,
  ): Promise<string> {
    try {
      // Convert buffer to base64
      const base64Audio = file.buffer.toString('base64');
      const dataURI = `data:${file.mimetype};base64,${base64Audio}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: folder,
        resource_type: 'video', // Audio files are treated as video in Cloudinary
        transformation: [{ quality: 'auto' }],
        chunk_size: 6000000, // 6MB chunks for large audio files
      });

      return result.secure_url;
    } catch (error) {
      console.error('Cloudinary audio upload error:', error);
      throw new Error('Failed to upload audio to Cloudinary');
    }
  }

  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Cloudinary delete error:', error);
      throw new Error('Failed to delete image from Cloudinary');
    }
  }
}

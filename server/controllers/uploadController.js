import cloudinary from '../config/cloudinary.js';

// @desc    Upload multiple product images/videos to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadProductImages = async (req, res) => {
  try {
    let files = [];

    if (req.files && req.files.length > 0) {
      files = req.files;
    }

    let base64Files = [];
    if (req.body && req.body.images) {
      if (Array.isArray(req.body.images)) {
        base64Files = req.body.images;
      } else if (typeof req.body.images === 'string') {
        base64Files = [req.body.images];
      }
    }

    if (files.length === 0 && base64Files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files provided for upload'
      });
    }

    const uploadPromises = [];

    // Process file buffers
    for (const file of files) {
      const isVideo = file.mimetype.startsWith('video/');
      const promise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: isVideo ? 'miliva/videos' : 'miliva/products',
            resource_type: isVideo ? 'video' : 'auto'
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result.secure_url);
            }
          }
        );
        stream.end(file.buffer);
      });
      uploadPromises.push(promise);
    }

    // Process base64 data URLs
    for (const b64 of base64Files) {
      if (typeof b64 === 'string' && b64.startsWith('data:')) {
        const isVideoB64 = b64.startsWith('data:video/');
        const promise = cloudinary.uploader.upload(b64, {
          folder: isVideoB64 ? 'miliva/videos' : 'miliva/products',
          resource_type: isVideoB64 ? 'video' : 'auto'
        }).then(result => result.secure_url);
        uploadPromises.push(promise);
      }
    }

    const uploadedUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Files uploaded successfully to Cloudinary',
      urls: uploadedUrls
    });
  } catch (error) {
    console.error('Cloudinary Upload Controller Exception:', error);
    res.status(500).json({
      success: false,
      message: error?.message || (typeof error === 'string' ? error : 'Failed to upload files to Cloudinary'),
      error: error
    });
  }
};

// @desc    Upload a single product video file to Cloudinary
// @route   POST /api/upload/video
// @access  Private/Admin
export const uploadVideo = async (req, res) => {
  try {
    let videoFile = req.file;
    let b64Video = req.body ? req.body.video : null;

    if (!videoFile && !b64Video) {
      return res.status(400).json({
        success: false,
        message: 'No video file provided'
      });
    }

    let videoUrl = '';

    if (videoFile) {
      videoUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'miliva/videos',
            resource_type: 'video'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          }
        );
        stream.end(videoFile.buffer);
      });
    } else if (b64Video) {
      const result = await cloudinary.uploader.upload(b64Video, {
        folder: 'miliva/videos',
        resource_type: 'video'
      });
      videoUrl = result.secure_url;
    }

    res.status(200).json({
      success: true,
      message: 'Video uploaded successfully to Cloudinary',
      url: videoUrl,
      videoUrl: videoUrl
    });
  } catch (error) {
    console.error('Cloudinary Video Upload Error:', error);
    res.status(500).json({
      success: false,
      message: error?.message || 'Failed to upload video file to Cloudinary',
      error: error
    });
  }
};

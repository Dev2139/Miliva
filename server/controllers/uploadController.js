import cloudinary from '../config/cloudinary.js';

// @desc    Upload multiple product images to Cloudinary
// @route   POST /api/upload
// @access  Private/Admin
export const uploadProductImages = async (req, res) => {
  try {
    let imageFiles = [];

    // Check if files attached via multipart form data (Multer memoryStorage)
    if (req.files && req.files.length > 0) {
      imageFiles = req.files;
    }

    // Also check if base64 data URLs passed in req.body.images
    let base64Images = [];
    if (req.body && req.body.images) {
      if (Array.isArray(req.body.images)) {
        base64Images = req.body.images;
      } else if (typeof req.body.images === 'string') {
        base64Images = [req.body.images];
      }
    }

    if (imageFiles.length === 0 && base64Images.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No image files provided for upload'
      });
    }

    const uploadPromises = [];

    // Process Multer file buffers
    for (const file of imageFiles) {
      const promise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'miliva/products',
            resource_type: 'image'
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
    for (const b64 of base64Images) {
      if (typeof b64 === 'string' && b64.startsWith('data:')) {
        const promise = cloudinary.uploader.upload(b64, {
          folder: 'miliva/products',
          resource_type: 'image'
        }).then(result => result.secure_url);
        uploadPromises.push(promise);
      }
    }

    const uploadedUrls = await Promise.all(uploadPromises);

    res.status(200).json({
      success: true,
      message: 'Images uploaded successfully to Cloudinary',
      urls: uploadedUrls
    });
  } catch (error) {
    console.error('Cloudinary Upload Controller Exception:', error);
    res.status(500).json({
      success: false,
      message: error?.message || (typeof error === 'string' ? error : 'Failed to upload images to Cloudinary'),
      error: error
    });
  }
};

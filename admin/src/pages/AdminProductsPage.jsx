import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { useAdminToast } from '../context/AdminToastContext';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiImage, 
  FiCheckCircle, 
  FiX, 
  FiLayers, 
  FiRefreshCw, 
  FiTag,
  FiStar,
  FiUploadCloud,
  FiVideo
} from 'react-icons/fi';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const { showToast } = useAdminToast();

  // Form state
  const initialForm = {
    name: '',
    slug: '',
    productType: 'cleanser',
    category: '',
    shortDescription: '',
    description: '',
    price: 349,
    compareAtPrice: 399,
    stock: 100,
    sku: '',
    ingredients: 'Salicylic Acid, Niacinamide, Hyaluronic Acid',
    howToUse: 'Apply 2-3 drops onto clean skin morning and evening.',
    isBestSeller: true,
    isNew: false,
    isFeatured: true,
    videoUrl: '',
    images: [
      { url: '/images/cleanser.svg', alt: 'MILIVA Face Cleanser Front', isPrimary: true },
      { url: '/images/cleanser.svg', alt: 'MILIVA Face Cleanser Texture', isPrimary: false }
    ],
    variants: [
      { size: '100ml', price: 349, compareAtPrice: 399, stock: 100, sku: 'MIL-FC-100' },
      { size: '200ml', price: 599, compareAtPrice: 699, stock: 80, sku: 'MIL-FC-200' }
    ]
  };

  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        adminService.getProducts(),
        adminService.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.products || []);
      if (catRes.success) setCategories(catRes.categories || []);
    } catch (err) {
      showToast('Error fetching products list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...initialForm,
      category: categories[0]?._id || ''
    });
    setShowModal(true);
  };

  const handleOpenEdit = (prod) => {
    setEditingId(prod._id);
    
    let formattedImages = [];
    if (Array.isArray(prod.images) && prod.images.length > 0) {
      formattedImages = prod.images.map((img, idx) => {
        if (typeof img === 'string') {
          return { url: img, alt: prod.name, isPrimary: idx === 0 };
        }
        return {
          url: img.url || '',
          alt: img.alt || prod.name,
          isPrimary: img.isPrimary || idx === 0
        };
      });
    } else {
      formattedImages = [{ url: '/images/cleanser.svg', alt: prod.name, isPrimary: true }];
    }

    setFormData({
      name: prod.name || '',
      slug: prod.slug || '',
      productType: prod.productType || 'cleanser',
      category: prod.category?._id || prod.category || '',
      shortDescription: prod.shortDescription || '',
      description: prod.description || '',
      price: prod.price || 0,
      compareAtPrice: prod.compareAtPrice || 0,
      stock: prod.stock || 0,
      sku: prod.sku || '',
      ingredients: Array.isArray(prod.ingredients) ? prod.ingredients.join(', ') : prod.ingredients || '',
      howToUse: prod.howToUse || '',
      isBestSeller: !!prod.isBestSeller,
      isNew: !!prod.isNew,
      isFeatured: !!prod.isFeatured,
      videoUrl: prod.videoUrl || '',
      images: formattedImages,
      variants: Array.isArray(prod.variants) && prod.variants.length > 0 ? prod.variants : [
        { size: 'Default', price: prod.price, compareAtPrice: prod.compareAtPrice, stock: prod.stock, sku: prod.sku }
      ]
    });
    setShowModal(true);
  };

  const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
    return new Promise((resolve) => {
      if (!file.type || !file.type.startsWith('image/')) return resolve(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".jpg"), {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => resolve(file);
      };
      reader.onerror = () => resolve(file);
    });
  };

  const handleDeviceFileUpload = async (e) => {
    const rawFiles = Array.from(e.target.files);
    if (!rawFiles || rawFiles.length === 0) return;

    setUploading(true);
    try {
      showToast(`Optimizing ${rawFiles.length} image(s)...`, 'info');
      const compressedFiles = await Promise.all(rawFiles.map(file => compressImageFile(file)));
      const uploadedUrls = [];

      for (let i = 0; i < compressedFiles.length; i++) {
        const file = compressedFiles[i];
        let url = null;

        try {
          const fileFormData = new FormData();
          fileFormData.append('images', file);
          const res = await adminService.uploadImages(fileFormData);
          if (res.success && Array.isArray(res.urls) && res.urls[0]) {
            url = res.urls[0];
          }
        } catch (backendErr) {
          console.warn(`Multipart upload failed for file ${i + 1}, trying JSON Base64 fallback...`, backendErr);
        }

        let b64DataUrl = null;
        try {
          b64DataUrl = await new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result);
            r.onerror = rej;
            r.readAsDataURL(file);
          });
        } catch (rErr) {
          console.warn('FileReader error:', rErr);
        }

        if (!url && b64DataUrl) {
          try {
            const res = await adminService.uploadImagesJson({ images: [b64DataUrl] });
            if (res.success && Array.isArray(res.urls) && res.urls[0]) {
              url = res.urls[0];
            }
          } catch (b64Err) {
            console.warn('Base64 backend upload failed:', b64Err);
          }
        }

        if (!url && b64DataUrl) {
          try {
            const cloudFd = new FormData();
            cloudFd.append('file', b64DataUrl);
            cloudFd.append('upload_preset', 'ml_default');
            const cRes = await fetch('https://api.cloudinary.com/v1_1/urzka7oz/image/upload', {
              method: 'POST',
              body: cloudFd
            });
            const cData = await cRes.json();
            if (cData.secure_url) {
              url = cData.secure_url;
            }
          } catch (cErr) {
            console.warn('Direct Cloudinary upload error:', cErr);
          }
        }

        if (!url && b64DataUrl) {
          url = b64DataUrl;
        }

        if (url) {
          uploadedUrls.push(url);
        }
      }

      if (uploadedUrls.length > 0) {
        const existingValid = formData.images.filter(img => img.url && img.url !== '/images/cleanser.svg');
        const newImages = uploadedUrls.map((url, idx) => ({
          url,
          alt: formData.name || 'Product Image',
          isPrimary: existingValid.length === 0 && idx === 0
        }));

        setFormData(prev => ({
          ...prev,
          images: [
            ...prev.images.filter(img => img.url && img.url !== '/images/cleanser.svg'),
            ...newImages
          ]
        }));

        showToast(`Uploaded ${uploadedUrls.length} image(s)!`, 'success');
      } else {
        showToast('Failed to upload images.', 'error');
      }
    } catch (err) {
      showToast('Error processing device images', 'error');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeviceVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      showToast('Uploading video file to Cloudinary...', 'info');
      let url = null;

      try {
        const fileFormData = new FormData();
        fileFormData.append('video', file);
        const res = await adminService.uploadVideo(fileFormData);
        if (res.success && (res.url || res.videoUrl)) {
          url = res.url || res.videoUrl;
        }
      } catch (backendErr) {
        console.warn('Multipart video upload failed, trying fallback...', backendErr);
      }

      let b64DataUrl = null;
      try {
        b64DataUrl = await new Promise((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.onerror = rej;
          r.readAsDataURL(file);
        });
      } catch (rErr) {
        console.warn('FileReader video error:', rErr);
      }

      if (!url && b64DataUrl) {
        try {
          const res = await adminService.uploadVideoJson({ video: b64DataUrl });
          if (res.success && (res.url || res.videoUrl)) {
            url = res.url || res.videoUrl;
          }
        } catch (b64Err) {
          console.warn('Base64 video upload failed:', b64Err);
        }
      }

      if (!url && b64DataUrl) {
        try {
          const cloudFd = new FormData();
          cloudFd.append('file', b64DataUrl);
          cloudFd.append('upload_preset', 'ml_default');
          const cRes = await fetch('https://api.cloudinary.com/v1_1/urzka7oz/video/upload', {
            method: 'POST',
            body: cloudFd
          });
          const cData = await cRes.json();
          if (cData.secure_url) {
            url = cData.secure_url;
          }
        } catch (cErr) {
          console.warn('Direct Cloudinary video upload error:', cErr);
        }
      }

      if (!url && b64DataUrl) {
        url = b64DataUrl;
      }

      if (url) {
        setFormData(prev => ({ ...prev, videoUrl: url }));
        showToast('Product video uploaded successfully!', 'success');
      } else {
        showToast('Failed to upload video to Cloudinary', 'error');
      }
    } catch (err) {
      showToast('Error processing device video file', 'error');
    } finally {
      setUploadingVideo(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index) => {
    setFormData(prev => {
      const updated = prev.images.filter((_, i) => i !== index);
      if (updated.length > 0 && !updated.some(img => img.isPrimary)) {
        updated[0].isPrimary = true;
      }
      return { ...prev, images: updated };
    });
  };

  const handleSetPrimaryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index
      }))
    }));
  };

  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      variants: [...prev.variants, { size: '100ml', price: 299, compareAtPrice: 349, stock: 50, sku: '' }]
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index)
    }));
  };

  const handleVariantChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.variants];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, variants: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const validImages = (formData.images || [])
        .filter(img => img.url && typeof img.url === 'string' && img.url.trim() !== '')
        .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0))
        .map(img => img.url);

      const payload = {
        ...formData,
        images: validImages.length > 0 ? validImages : ['/images/cleanser.svg'],
        ingredients: typeof formData.ingredients === 'string' 
          ? formData.ingredients.split(',').map(s => s.trim()).filter(Boolean)
          : formData.ingredients,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice),
        stock: Number(formData.stock)
      };

      if (editingId) {
        const res = await adminService.updateProduct(editingId, payload);
        if (res.success) {
          showToast('Product updated successfully', 'success');
        }
      } else {
        const res = await adminService.createProduct(payload);
        if (res.success) {
          showToast('Product created successfully', 'success');
        }
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save product', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this product?')) return;
    try {
      const res = await adminService.deleteProduct(id);
      if (res.success) {
        showToast('Product deactivated successfully', 'success');
        loadData();
      }
    } catch (err) {
      showToast('Failed to delete product', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-cream border border-subtle p-6 shadow-xs">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 block mb-1">
            Catalogue Operations
          </span>
          <h2 className="text-2xl font-light text-neutral-900 font-editorial">MILIVA Product Master</h2>
          <p className="text-xs text-neutral-600 mt-1">Manage single items, multi-image galleries, and size variants matrix.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-neutral-900 hover:bg-black text-white font-bold px-4 py-2.5 text-xs uppercase tracking-wider transition-colors shadow-xs"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-7 h-7 text-neutral-900 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-subtle p-12 text-center shadow-xs">
          <FiTag className="w-10 h-10 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-light text-neutral-900 font-editorial">No products found</h3>
          <p className="text-xs text-neutral-500 mt-1">Click "Add New Product" to start building your MILIVA catalogue.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {products.map((prod) => {
            const primaryImg = Array.isArray(prod.images) && prod.images.length > 0
              ? (typeof prod.images[0] === 'string' ? prod.images[0] : prod.images[0].url)
              : '/images/cleanser.svg';

            const imagesCount = Array.isArray(prod.images) ? prod.images.length : 1;

            return (
              <div 
                key={prod._id}
                className="bg-white border border-subtle p-5 hover:border-neutral-400 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs"
              >
                {/* Left: Image & Info */}
                <div className="flex items-start sm:items-center space-x-4 min-w-0">
                  <div className="relative shrink-0">
                    <img 
                      src={primaryImg} 
                      alt={prod.name}
                      className="w-20 h-20 object-contain bg-cream p-2 border border-subtle"
                    />
                    <span className="absolute bottom-1 right-1 bg-neutral-900 text-white text-[9px] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                      {imagesCount} {imagesCount === 1 ? 'img' : 'imgs'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 border border-neutral-300 text-neutral-800">
                        {prod.productType || 'Cleanser'}
                      </span>
                      {prod.isBestSeller && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-900">
                          Best Seller
                        </span>
                      )}
                      {prod.videoUrl && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-900 flex items-center gap-1">
                          <FiVideo className="w-3 h-3" /> Video
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-neutral-900">{prod.name}</h3>
                    <p className="text-xs text-neutral-500 line-clamp-1">{prod.shortDescription}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-600 pt-1">
                      <span>SKU: <strong className="text-neutral-900 font-mono">{prod.sku}</strong></span>
                      <span>Category: <strong className="text-neutral-900">{prod.category?.name || 'Skincare'}</strong></span>
                      <span>Stock: <strong className="text-emerald-800 font-bold">{prod.stock} units</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Variants Preview & Actions */}
                <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-subtle pt-4 md:pt-0">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Available Sizes</p>
                    <div className="flex items-center space-x-1.5 mt-1 justify-end">
                      {prod.variants && prod.variants.length > 0 ? (
                        prod.variants.map((v, i) => (
                          <span key={i} className="text-xs px-2 py-1 bg-cream border border-subtle text-neutral-900 font-mono font-bold">
                            {v.size}: ₹{v.price}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs px-2 py-1 bg-cream border border-subtle text-neutral-900 font-bold">
                          ₹{prod.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2.5 bg-neutral-900 hover:bg-black text-white transition-colors"
                      title="Edit Product"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                      title="Deactivate Product"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-neutral-300 w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-cream border-b border-subtle flex items-center justify-between">
              <h3 className="text-lg font-light text-neutral-900 font-editorial">
                {editingId ? 'Edit Product & Media Gallery' : 'Add New Skincare Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-neutral-500 hover:text-neutral-900"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. MILIVA Face Cleanser"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="e.g. miliva-face-cleanser"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    Product Type
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value="cleanser">Cleanser</option>
                    <option value="serum">Serum</option>
                    <option value="moisturizer">Moisturizer</option>
                    <option value="combo">Combo / Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  placeholder="Gentle daily cleanser with 2% Salicylic Acid"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                  placeholder="Comprehensive description of formula benefits, ingredients, dermatological testing..."
                />
              </div>

              {/* MULTIPLE IMAGES DIRECT DEVICE UPLOAD TO CLOUDINARY */}
              <div className="bg-cream border border-subtle p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 flex items-center font-editorial">
                    <FiImage className="w-4 h-4 mr-2 text-neutral-700" />
                    Product Images (Direct Device Upload)
                  </h4>
                  <p className="text-[11px] text-neutral-600">
                    Upload multiple high-res product photos from your local device.
                  </p>
                </div>

                <div className="border-2 border-dashed border-neutral-300 bg-white hover:border-neutral-900 p-6 text-center cursor-pointer transition-colors relative">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center space-y-1">
                    {uploading ? (
                      <>
                        <FiRefreshCw className="w-6 h-6 text-neutral-900 animate-spin" />
                        <p className="text-xs font-bold text-neutral-900">Uploading to Cloudinary...</p>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className="w-6 h-6 text-neutral-700" />
                        <p className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                          Click or Drag & Drop Images from Device
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Select multiple files (PNG, JPG, WEBP).
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Uploaded Images List */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block">
                    Product Gallery ({formData.images.filter(i => i.url && i.url !== '/images/cleanser.svg').length} images)
                  </span>

                  {formData.images.filter(img => img.url && img.url !== '/images/cleanser.svg').length === 0 ? (
                    <div className="p-3 bg-white border border-neutral-200 text-center text-[11px] text-neutral-500 italic">
                      No images uploaded yet. Select files above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-2">
                      {formData.images.filter(img => img.url && img.url !== '/images/cleanser.svg').map((img, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-2.5 bg-white border border-neutral-200">
                          <img
                            src={img.url}
                            alt={img.alt || 'Product Image'}
                            className="w-12 h-12 object-cover bg-cream border border-neutral-200 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider inline-block">
                              Cloudinary
                            </span>
                            <p className="text-[10px] text-neutral-500 truncate font-mono mt-0.5">{img.url}</p>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 border ${
                                img.isPrimary 
                                  ? 'bg-neutral-900 text-white border-neutral-900' 
                                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
                              }`}
                            >
                              {img.isPrimary ? 'Primary' : 'Set Primary'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 text-rose-600 hover:bg-rose-50"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SIZE VARIANTS SECTION */}
              <div className="bg-cream border border-subtle p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900 flex items-center font-editorial">
                      <FiTag className="w-4 h-4 mr-2 text-neutral-700" />
                      Size Variants Matrix
                    </h4>
                    <p className="text-[11px] text-neutral-600">Configure prices and inventory per size variant</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="text-xs font-bold text-neutral-900 uppercase tracking-wider bg-white border border-neutral-300 hover:bg-neutral-100 px-3 py-1.5 flex items-center gap-1 shadow-2xs"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Add Size Variant</span>
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-white border border-neutral-200 items-center">
                      <div>
                        <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">Size</span>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="w-full bg-white border border-neutral-300 px-2 py-1 text-xs text-neutral-900"
                          placeholder="100ml"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">Price (₹)</span>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))}
                          className="w-full bg-white border border-neutral-300 px-2 py-1 text-xs text-neutral-900"
                          placeholder="349"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">Compare At</span>
                        <input
                          type="number"
                          value={v.compareAtPrice}
                          onChange={(e) => handleVariantChange(idx, 'compareAtPrice', Number(e.target.value))}
                          className="w-full bg-white border border-neutral-300 px-2 py-1 text-xs text-neutral-900"
                          placeholder="399"
                        />
                      </div>
                      <div>
                        <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">Stock</span>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                          className="w-full bg-white border border-neutral-300 px-2 py-1 text-xs text-neutral-900"
                          placeholder="100"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <span className="text-[9px] text-neutral-500 font-bold block uppercase tracking-wider">SKU</span>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                            className="w-full bg-white border border-neutral-300 px-2 py-1 text-xs text-neutral-900 font-mono"
                            placeholder="MIL-FC-100"
                          />
                        </div>
                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1 text-rose-600 hover:bg-rose-50 mt-3"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ingredients & How to Use */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    Key Ingredients
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="2% Salicylic Acid, Niacinamide"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700 block mb-1">
                    How To Use
                  </label>
                  <input
                    type="text"
                    value={formData.howToUse}
                    onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
                    placeholder="Lather on wet face twice daily..."
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-neutral-900"
                  />
                  <span className="text-xs text-neutral-800 font-medium">Best Seller Badge</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-neutral-900"
                  />
                  <span className="text-xs text-neutral-800 font-medium">New Arrival Badge</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-neutral-900"
                  />
                  <span className="text-xs text-neutral-800 font-medium">Homepage Featured</span>
                </label>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-subtle flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 font-bold uppercase text-xs tracking-wider hover:bg-neutral-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-neutral-900 text-white font-bold uppercase text-xs tracking-wider hover:bg-black shadow-xs"
                >
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

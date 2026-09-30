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
    // Multiple Images Support
    images: [
      { url: '/images/cleanser.svg', alt: 'MILIVA Face Cleanser Front', isPrimary: true },
      { url: '/images/cleanser.svg', alt: 'MILIVA Face Cleanser Texture', isPrimary: false }
    ],
    // Size Variants Support
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
    
    // Process images array for multi-image editor
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

  // Dynamic Image Handlers & Resilient Device Upload to Cloudinary
  const handleDeviceFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      let uploadedUrls = [];

      // Method 1: Multipart FormData upload
      try {
        const fileFormData = new FormData();
        files.forEach((file) => {
          fileFormData.append('images', file);
        });
        const res = await adminService.uploadImages(fileFormData);
        if (res.success && Array.isArray(res.urls) && res.urls.length > 0) {
          uploadedUrls = res.urls;
        }
      } catch (backendErr) {
        console.warn('Multipart upload failed, trying Base64 JSON fallback...', backendErr);
      }

      // Method 2: Base64 JSON upload fallback
      if (uploadedUrls.length === 0) {
        const b64Promises = files.map(file => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        }));

        const b64Strings = await Promise.all(b64Promises);
        
        try {
          const res = await adminService.uploadImagesJson({ images: b64Strings });
          if (res.success && Array.isArray(res.urls) && res.urls.length > 0) {
            uploadedUrls = res.urls;
          }
        } catch (jsonErr) {
          console.warn('Base64 backend upload failed, using Data URLs for image state...', jsonErr);
          uploadedUrls = b64Strings;
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

        showToast(`Successfully added ${uploadedUrls.length} product image(s)!`, 'success');
      } else {
        showToast('Failed to process image files', 'error');
      }
    } catch (err) {
      showToast('Error processing device images', 'error');
    } finally {
      setUploading(false);
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

  // Dynamic Variant Handlers
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
      // Format Cloudinary images for MongoDB (primary image first)
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
        // Ensure price is numeric
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice),
        stock: Number(formData.stock)
      };

      if (editingId) {
        const res = await adminService.updateProduct(editingId, payload);
        if (res.success) {
          showToast('Product updated successfully with Cloudinary images', 'success');
        }
      } else {
        const res = await adminService.createProduct(payload);
        if (res.success) {
          showToast('Product created successfully with Cloudinary images', 'success');
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
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <div>
          <h2 className="text-xl font-bold text-white">MILIVA Product Catalogue</h2>
          <p className="text-neutral-400 text-sm mt-1">Manage single items, multiple product images, and size variants</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-lg shadow-emerald-500/10"
        >
          <FiPlus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Product List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
          <FiTag className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No products found</h3>
          <p className="text-neutral-400 text-sm mt-1">Click "Add New Product" to start building your MILIVA catalogue.</p>
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
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 hover:border-neutral-700 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start sm:items-center space-x-4 min-w-0">
                  <div className="relative group">
                    <img 
                      src={primaryImg} 
                      alt={prod.name}
                      className="w-20 h-20 rounded-xl object-contain bg-neutral-950 p-2 border border-neutral-800"
                    />
                    <span className="absolute bottom-1 right-1 bg-neutral-900/90 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {imagesCount} {imagesCount === 1 ? 'img' : 'imgs'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 uppercase tracking-wider border border-emerald-500/30">
                        {prod.productType || 'Cleanser'}
                      </span>
                      {prod.isBestSeller && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          Best Seller
                        </span>
                      )}
                      {prod.videoUrl && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center">
                          <FiVideo className="w-3 h-3 mr-1" /> Video Included
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-white">{prod.name}</h3>
                    <p className="text-xs text-neutral-400 line-clamp-1">{prod.shortDescription}</p>

                    <div className="flex items-center space-x-4 text-xs text-neutral-300 pt-1">
                      <span>SKU: <strong className="text-neutral-100 font-mono">{prod.sku}</strong></span>
                      <span>Category: <strong className="text-neutral-100">{prod.category?.name || 'Skincare'}</strong></span>
                      <span>Stock: <strong className="text-emerald-400">{prod.stock} units</strong></span>
                    </div>
                  </div>
                </div>

                {/* Right: Variants Preview & Actions */}
                <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-neutral-800 pt-4 md:pt-0">
                  {/* Variants List Pill */}
                  <div className="text-right">
                    <p className="text-xs font-semibold text-neutral-400">Available Sizes</p>
                    <div className="flex items-center space-x-1 mt-1 justify-end">
                      {prod.variants && prod.variants.length > 0 ? (
                        prod.variants.map((v, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-200 font-mono">
                            {v.size}: ₹{v.price}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs px-2 py-1 rounded bg-neutral-950 border border-neutral-800 text-neutral-200">
                          ₹{prod.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-emerald-400 transition-colors border border-neutral-700"
                      title="Edit Product & Multi-Images"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(prod._id)}
                      className="p-2.5 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors border border-neutral-700"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">
                {editingId ? 'Edit Product & Multi-Image Gallery' : 'Add New Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. MILIVA Face Cleanser"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="e.g. miliva-face-cleanser"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Product Type
                  </label>
                  <select
                    value={formData.productType}
                    onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="cleanser">Cleanser</option>
                    <option value="serum">Serum</option>
                    <option value="moisturizer">Moisturizer</option>
                    <option value="combo">Combo / Bundle</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
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
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Short Tagline / Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Gentle daily cleanser with 2% Salicylic Acid for acne-prone skin"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                  Full Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Comprehensive description of formula benefits, dermatological testing, texture details..."
                />
              </div>

              {/* MULTIPLE IMAGES DIRECT DEVICE UPLOAD TO CLOUDINARY */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center">
                    <FiImage className="w-4 h-4 mr-2 text-emerald-400" />
                    Product Images (Direct Device Upload to Cloudinary)
                  </h4>
                  <p className="text-xs text-neutral-400">
                    Upload multiple high-res product photos from your local device. Images are uploaded to Cloudinary and saved directly to the database.
                  </p>
                </div>

                {/* File Dropzone Input */}
                <div className="border-2 border-dashed border-neutral-800 hover:border-emerald-500 rounded-xl p-6 text-center cursor-pointer transition-colors relative bg-neutral-900/50">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleDeviceFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={uploading}
                  />
                  <div className="flex flex-col items-center justify-center space-y-2">
                    {uploading ? (
                      <>
                        <FiRefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
                        <p className="text-sm font-bold text-emerald-400">Uploading to Cloudinary...</p>
                        <p className="text-xs text-neutral-400">Uploading device files and storing Cloudinary URLs</p>
                      </>
                    ) : (
                      <>
                        <FiUploadCloud className="w-8 h-8 text-emerald-400" />
                        <p className="text-sm font-bold text-white">
                          Click or Drag & Drop Images from Device
                        </p>
                        <p className="text-xs text-neutral-400">
                          Select multiple image files (PNG, JPG, WEBP). Images will upload straight to Cloudinary.
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Uploaded Images List */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Uploaded Product Gallery ({formData.images.filter(i => i.url && i.url !== '/images/cleanser.svg').length} images)
                  </span>

                  {formData.images.filter(img => img.url && img.url !== '/images/cleanser.svg').length === 0 ? (
                    <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl text-center text-xs text-neutral-500">
                      No images uploaded yet. Select files above from your device.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {formData.images.filter(img => img.url && img.url !== '/images/cleanser.svg').map((img, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl">
                          {/* Image Preview */}
                          <img
                            src={img.url}
                            alt={img.alt || 'Product Image'}
                            className="w-14 h-14 rounded-lg object-cover bg-neutral-950 border border-neutral-800 shrink-0"
                          />

                          <div className="flex-1 min-w-0 space-y-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 inline-block">
                              Cloudinary Image
                            </span>
                            <p className="text-xs text-neutral-400 truncate font-mono">{img.url}</p>
                          </div>

                          <div className="flex items-center space-x-2 shrink-0">
                            {/* Primary Toggle */}
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className={`text-[11px] px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                                img.isPrimary 
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
                              }`}
                            >
                              {img.isPrimary ? 'Primary Image' : 'Set Primary'}
                            </button>

                            {/* Delete Image button */}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                              title="Delete Image"
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

              {/* PRODUCT VIDEO URL SECTION */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center">
                    <FiVideo className="w-4 h-4 mr-2 text-emerald-400" />
                    Product Demonstration Video (Optional)
                  </h4>
                  <p className="text-xs text-neutral-400">Add an MP4 video URL or embed link to showcase texture, application & results</p>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="e.g. /videos/cleanser-demo.mp4 or https://cdn.miliva.com/videos/serum-texture.mp4"
                  />

                  {formData.videoUrl && (
                    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="font-semibold flex items-center text-emerald-400">
                          <FiCheckCircle className="w-3.5 h-3.5 mr-1" /> Video URL Preview
                        </span>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, videoUrl: '' })}
                          className="text-red-400 hover:text-red-300 text-[11px]"
                        >
                          Remove Video
                        </button>
                      </div>
                      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-neutral-800 max-h-48">
                        {formData.videoUrl.endsWith('.mp4') || formData.videoUrl.endsWith('.webm') || formData.videoUrl.startsWith('/videos') ? (
                          <video 
                            src={formData.videoUrl} 
                            controls 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <iframe
                            src={formData.videoUrl}
                            title="Product Video"
                            className="w-full h-full border-0"
                            allowFullScreen
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* SIZE VARIANTS SECTION */}
              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      <FiTag className="w-4 h-4 mr-2 text-emerald-400" />
                      Size Variants & Pricing Matrix
                    </h4>
                    <p className="text-xs text-neutral-400">Configure prices and inventory per size variant (e.g. 100ml / 200ml)</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/30 transition-colors"
                  >
                    <FiPlus className="w-3.5 h-3.5" />
                    <span>Add Size Variant</span>
                  </button>
                </div>

                <div className="space-y-3 pt-2">
                  {formData.variants.map((v, idx) => (
                    <div key={idx} className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 bg-neutral-900 border border-neutral-800 rounded-xl items-center">
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">Size</span>
                        <input
                          type="text"
                          value={v.size}
                          onChange={(e) => handleVariantChange(idx, 'size', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="100ml"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">Price (₹)</span>
                        <input
                          type="number"
                          value={v.price}
                          onChange={(e) => handleVariantChange(idx, 'price', Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="349"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">Compare At (₹)</span>
                        <input
                          type="number"
                          value={v.compareAtPrice}
                          onChange={(e) => handleVariantChange(idx, 'compareAtPrice', Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="399"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-400 font-semibold block uppercase">Stock</span>
                        <input
                          type="number"
                          value={v.stock}
                          onChange={(e) => handleVariantChange(idx, 'stock', Number(e.target.value))}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                          placeholder="100"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1">
                          <span className="text-[10px] text-neutral-400 font-semibold block uppercase">SKU</span>
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => handleVariantChange(idx, 'sku', e.target.value)}
                            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                            placeholder="MIL-FC-100"
                          />
                        </div>
                        {formData.variants.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveVariant(idx)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 mt-3"
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
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    Key Ingredients (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={formData.ingredients}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="2% Salicylic Acid, Niacinamide, Aloe Vera"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-1">
                    How To Use Instructions
                  </label>
                  <input
                    type="text"
                    value={formData.howToUse}
                    onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                    placeholder="Lather on wet face twice daily..."
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-sm text-neutral-200">Best Seller Badge</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNew}
                    onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-sm text-neutral-200">New Arrival Badge</span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <span className="text-sm text-neutral-200">Homepage Featured</span>
                </label>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-neutral-950 font-bold shadow-lg shadow-emerald-500/10"
                >
                  {editingId ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

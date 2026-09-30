import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get Admin Dashboard Stats & Analytics
// @route   GET /api/admin/dashboard
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments({ isActive: true });
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    // Revenue calculations
    const paidOrders = await Order.find({
      orderStatus: { $nin: ['Cancelled', 'Returned', 'Refunded'] }
    });
    
    const totalSales = paidOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Today sales
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfToday },
      orderStatus: { $nin: ['Cancelled', 'Returned', 'Refunded'] }
    });

    const todaySales = todayOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = paidOrders.length > 0 ? Math.round(totalSales / paidOrders.length) : 0;

    // Low stock products alert (stock < 10)
    const lowStockProducts = await Product.find({ isActive: true, stock: { $lte: 10 } })
      .select('name sku stock price images category')
      .populate('category', 'name');

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // Top selling products count aggregation
    const topProducts = await Product.find({ isActive: true })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5)
      .select('name price rating reviewCount stock images');

    res.json({
      success: true,
      stats: {
        totalSales,
        todaySales,
        totalOrders,
        todayOrdersCount: todayOrders.length,
        totalCustomers,
        totalProducts,
        avgOrderValue
      },
      lowStockProducts,
      recentOrders,
      topProducts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin customers list
// @route   GET /api/admin/customers
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    
    // Attach spending stats to each customer
    const customerStats = await Promise.all(
      customers.map(async (cust) => {
        const orders = await Order.find({ user: cust._id, orderStatus: { $nin: ['Cancelled', 'Refunded'] } });
        const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
        return {
          ...cust.toObject(),
          orderCount: orders.length,
          totalSpent
        };
      })
    );

    res.json({ success: true, customers: customerStats });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user status (Active/Deactive)
// @route   PUT /api/admin/customers/:id/toggle
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ success: true, message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}`, isActive: user.isActive });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory & Stock report
// @route   GET /api/admin/inventory
export const getInventoryReport = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('name sku price compareAtPrice stock category isBestSeller isNew')
      .populate('category', 'name')
      .sort({ stock: 1 });

    const summary = {
      totalItems: products.length,
      outOfStock: products.filter(p => p.stock === 0).length,
      lowStock: products.filter(p => p.stock > 0 && p.stock <= 10).length,
      inStock: products.filter(p => p.stock > 10).length
    };

    res.json({ success: true, summary, products });
  } catch (error) {
    next(error);
  }
};

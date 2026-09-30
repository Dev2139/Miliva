import Address from '../models/Address.js';

export const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const existingCount = await Address.countDocuments({ user: req.user._id });
    const isFirst = existingCount === 0;

    const address = new Address({
      ...req.body,
      user: req.user._id,
      isDefault: req.body.isDefault || isFirst
    });

    if (address.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    await address.save();
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(201).json({ success: true, message: 'Address saved', addresses });
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req, res, next) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, req.body);
    await address.save();

    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, message: 'Address updated', addresses });
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const remaining = await Address.find({ user: req.user._id }).sort({ createdAt: -1 });
    if (remaining.length > 0 && !remaining.some(a => a.isDefault)) {
      remaining[0].isDefault = true;
      await remaining[0].save();
    }

    res.json({ success: true, message: 'Address deleted', addresses: remaining });
  } catch (error) {
    next(error);
  }
};

export const setDefaultAddress = async (req, res, next) => {
  try {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    await Address.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isDefault: true });

    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, message: 'Default address set', addresses });
  } catch (error) {
    next(error);
  }
};

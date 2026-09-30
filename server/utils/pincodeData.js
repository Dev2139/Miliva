export const checkPincodeDelivery = (pincode) => {
  if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    return {
      serviceable: false,
      message: 'Please enter a valid 6-digit Indian pincode.'
    };
  }

  // Common tier 1/2/3 pincode prefix checks
  const prefix = pincode.substring(0, 2);
  const estimatedDays = ['11', '40', '56', '60', '70'].includes(prefix) ? 2 : 4;
  
  const today = new Date();
  const deliveryDate = new Date(today.setDate(today.getDate() + estimatedDays));
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  
  return {
    serviceable: true,
    pincode,
    estimatedDays,
    estimatedDeliveryDate: deliveryDate.toLocaleDateString('en-IN', options),
    codAvailable: true,
    expressAvailable: estimatedDays === 2,
    message: `Delivery available by ${deliveryDate.toLocaleDateString('en-IN', options)}. Cash on Delivery (COD) available.`
  };
};

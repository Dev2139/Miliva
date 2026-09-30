import React, { useState } from 'react';
import { FiMapPin, FiTruck, FiCheck, FiX } from 'react-icons/fi';
import { productService } from '../../services/productService';

const PincodeChecker = () => {
  const [pincode, setPincode] = useState('');
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!pincode || pincode.length !== 6) {
      setError('Please enter a valid 6-digit pincode');
      return;
    }
    setError('');
    setChecking(true);
    try {
      const res = await productService.checkPincode(pincode);
      if (res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError('Could not verify pincode delivery');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-4 bg-cream border border-subtle space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-neutral-900 uppercase tracking-wider">
        <FiMapPin className="w-4 h-4 text-neutral-700" />
        <span>Delivery & Service Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit Pincode"
          className="flex-1 px-3 py-2 text-xs border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
        />
        <button
          type="submit"
          disabled={checking}
          className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase font-bold tracking-widest disabled:opacity-50"
        >
          {checking ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      {result && (
        <div className="pt-2 text-xs text-neutral-700 space-y-1.5 border-t border-subtle">
          <p className="font-semibold text-neutral-900 flex items-center gap-1.5">
            <FiTruck className="w-4 h-4 text-emerald-700" />
            <span>Delivery by <strong className="underline">{result.estimatedDeliveryDate}</strong></span>
          </p>
          <div className="flex items-center gap-3 text-[11px] text-neutral-600">
            <span className="flex items-center gap-1"><FiCheck className="text-emerald-600" /> COD Available</span>
            <span className="flex items-center gap-1"><FiCheck className="text-emerald-600" /> Free Shipping above ₹999</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PincodeChecker;

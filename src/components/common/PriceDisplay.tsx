import React from 'react';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number | null;
  discountPercentage?: number;
  size?: 'sm' | 'md' | 'lg';
  showDecimals?: boolean;
}

/** Displays Selling Price alongside dynamic MRP and % discount when available. */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  discountPercentage,
  size = 'md',
  showDecimals = false,
}) => {
  const hasDiscount = Boolean(originalPrice && originalPrice > price);
  const computedDiscount =
    discountPercentage ??
    (hasDiscount
      ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
      : null);

  const formatAmount = (amount: number) =>
    `₹${amount.toLocaleString('en-IN')}${showDecimals ? '.00' : ''}`;

  const spClass =
    size === 'lg'
      ? 'text-2xl sm:text-3xl font-extrabold text-brand-900'
      : size === 'sm'
      ? 'text-sm sm:text-base font-bold text-stone-900'
      : 'text-lg sm:text-xl font-bold text-brand-900';

  const mrpClass =
    size === 'lg'
      ? 'text-sm sm:text-base text-ink-muted line-through font-normal'
      : 'text-[11px] sm:text-xs text-ink-muted line-through font-normal';

  const discountClass =
    size === 'lg'
      ? 'rounded-md bg-brand-100 px-2 py-0.5 text-xs font-bold text-brand-800'
      : 'rounded-xs bg-brand-100 px-1.5 py-0.5 text-[10px] font-bold text-brand-800';

  return (
    <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
      <span className={spClass}>{formatAmount(price)}</span>
      {hasDiscount && originalPrice && (
        <span className={mrpClass}>{formatAmount(originalPrice)}</span>
      )}
      {computedDiscount && computedDiscount > 0 && (
        <span className={discountClass}>{computedDiscount}% OFF</span>
      )}
    </div>
  );
};


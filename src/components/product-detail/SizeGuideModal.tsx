import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, AlertCircle, Image as ImageIcon, Table } from 'lucide-react';
import { Product } from '../../types/product';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose, product }) => {
  const hasCustomChart = Boolean(product?.sizeGuideImageUrl);
  const [activeTab, setActiveTab] = useState<'custom' | 'table'>(hasCustomChart ? 'custom' : 'table');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink-primary/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl z-10 overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-ivory-300 flex items-center justify-between bg-ivory-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-700">
              <Ruler className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-ink-primary">
                Ethnic & Maternity Size Guide
              </h3>
              <p className="text-[11px] text-ink-muted">
                {hasCustomChart
                  ? `${product?.title || 'Garment'} Official Tailored Specs`
                  : 'Indicative Generic Measurements (in inches) • Boutique Standard'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close size guide"
            className="p-1.5 rounded-full hover:bg-ivory-200 text-ink-secondary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher if custom chart is available */}
        {hasCustomChart && (
          <div className="flex border-b border-ivory-300 bg-ivory-100/60 px-4 pt-2 gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('custom')}
              className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'custom'
                  ? 'border-brand-700 text-brand-900'
                  : 'border-transparent text-ink-muted hover:text-ink-primary'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Garment Size Chart</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('table')}
              className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-1.5 border-b-2 transition-all ${
                activeTab === 'table'
                  ? 'border-brand-700 text-brand-900'
                  : 'border-transparent text-ink-muted hover:text-ink-primary'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Standard Measurements Table</span>
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          {activeTab === 'custom' && product?.sizeGuideImageUrl ? (
            <div className="space-y-4">
              <div className="rounded-xl overflow-hidden border border-ivory-300 bg-ivory-50/50 flex items-center justify-center p-2">
                <img
                  src={product.sizeGuideImageUrl}
                  alt={`${product.title} size guide`}
                  className="max-h-[60vh] w-auto max-w-full rounded-lg object-contain shadow-xs"
                />
              </div>

              {product.sizeGuideText && (
                <div className="p-3.5 bg-brand-50/70 border border-brand-200 rounded-xl text-xs text-brand-900 leading-relaxed whitespace-pre-line">
                  <div className="font-bold mb-1 flex items-center gap-1.5 text-brand-800">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Garment Fitting Notes</span>
                  </div>
                  {product.sizeGuideText}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Sample Sizing Reference Notice */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Boutique Sizing Reference:</strong> The measurements displayed below represent standard generic Indian sizing benchmarks for Sony Collections.
                </div>
              </div>

              {/* Indicative Ease Note */}
              <div className="p-3.5 bg-brand-50/70 border border-brand-200 rounded-xl text-xs text-brand-900 leading-relaxed flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                <div>
                  <strong>Maternity & Feeding Comfort:</strong> Sony Collections feeding silhouettes feature concealed dual vertical zips and relaxed ease across bust and waist for maximum all-day comfort.
                </div>
              </div>

              {/* Measurement Table */}
              <div className="overflow-x-auto border border-ivory-300 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-ivory-100/80 text-ink-primary border-b border-ivory-300">
                      <th className="py-2.5 px-3 font-bold">Size</th>
                      <th className="py-2.5 px-3 font-bold">Bust (in)</th>
                      <th className="py-2.5 px-3 font-bold">Waist (in)</th>
                      <th className="py-2.5 px-3 font-bold">Hip (in)</th>
                      <th className="py-2.5 px-3 font-bold">Kurti / Frock Length</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ivory-200 text-ink-secondary">
                    <tr className="hover:bg-ivory-50">
                      <td className="py-2.5 px-3 font-bold text-ink-primary">S (36)</td>
                      <td className="py-2.5 px-3">36"</td>
                      <td className="py-2.5 px-3">32"</td>
                      <td className="py-2.5 px-3">38"</td>
                      <td className="py-2.5 px-3">46" - 48"</td>
                    </tr>
                    <tr className="hover:bg-ivory-50 bg-ivory-50/40">
                      <td className="py-2.5 px-3 font-bold text-ink-primary">M (38)</td>
                      <td className="py-2.5 px-3">38"</td>
                      <td className="py-2.5 px-3">34"</td>
                      <td className="py-2.5 px-3">40"</td>
                      <td className="py-2.5 px-3">46" - 48"</td>
                    </tr>
                    <tr className="hover:bg-ivory-50">
                      <td className="py-2.5 px-3 font-bold text-ink-primary">L (40)</td>
                      <td className="py-2.5 px-3">40"</td>
                      <td className="py-2.5 px-3">36"</td>
                      <td className="py-2.5 px-3">42"</td>
                      <td className="py-2.5 px-3">48" - 50"</td>
                    </tr>
                    <tr className="hover:bg-ivory-50 bg-ivory-50/40">
                      <td className="py-2.5 px-3 font-bold text-ink-primary">XL (42)</td>
                      <td className="py-2.5 px-3">42"</td>
                      <td className="py-2.5 px-3">38"</td>
                      <td className="py-2.5 px-3">44"</td>
                      <td className="py-2.5 px-3">48" - 50"</td>
                    </tr>
                    <tr className="hover:bg-ivory-50">
                      <td className="py-2.5 px-3 font-bold text-ink-primary">XXL (44)</td>
                      <td className="py-2.5 px-3">44"</td>
                      <td className="py-2.5 px-3">40"</td>
                      <td className="py-2.5 px-3">46"</td>
                      <td className="py-2.5 px-3">50" - 52"</td>
                    </tr>
                    <tr className="hover:bg-ivory-50 bg-ivory-50/40">
                      <td className="py-2.5 px-3 font-bold text-ink-primary">Free Size</td>
                      <td className="py-2.5 px-3" colSpan={4}>
                        Standard unstitched / draped sizing (e.g. Sarees: 5.5m + 0.8m blouse piece)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Measuring Guidance */}
              <div className="space-y-2 text-xs text-ink-secondary">
                <h4 className="font-bold text-ink-primary">How to measure yourself:</h4>
                <ul className="list-disc pl-5 space-y-1 text-[11px] leading-relaxed">
                  <li><strong>Bust:</strong> Measure around the fullest part of your chest, keeping the tape level.</li>
                  <li><strong>Waist:</strong> Measure around the narrowest part of your natural waistline.</li>
                  <li><strong>Length:</strong> Measured from the highest point of shoulder seam down to bottom hem.</li>
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-ivory-300 bg-ivory-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-brand-700 text-white rounded-xl text-xs font-semibold hover:bg-brand-800 transition-colors"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};


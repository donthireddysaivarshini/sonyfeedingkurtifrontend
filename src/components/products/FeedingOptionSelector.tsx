import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { ClothingType } from '../../types/product';

interface FeedingOptionSelectorProps {
  selectedType: ClothingType | null;
  onSelect: (type: ClothingType) => void;
  showPromptError?: boolean;
}

const FEEDING_OPTIONS: { type: ClothingType; label: string; subtitle: string }[] = [
  {
    type: 'Feeding',
    label: 'Feeding-Friendly',
    subtitle: 'Discreet dual side zips',
  },
  {
    type: 'Non-Feeding',
    label: 'Non-Feeding',
    subtitle: 'Standard tailored fit',
  },
];

/** Shared Feeding vs Non-Feeding selector with solid filled active state. */
export const FeedingOptionSelector: React.FC<FeedingOptionSelectorProps> = ({
  selectedType,
  onSelect,
  showPromptError = false,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold uppercase tracking-wider text-ink-primary flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-700" />
          <span>Choose Feeding Option</span>
          <span className="text-rose-600">*</span>
        </label>
        {showPromptError && !selectedType && (
          <span className="text-[11px] font-semibold text-rose-600">
            Select an option
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {FEEDING_OPTIONS.map((opt) => {
          const isSelected = selectedType === opt.type;
          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => onSelect(opt.type)}
              aria-pressed={isSelected}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'border-brand-800 bg-brand-800 text-white shadow-md ring-2 ring-brand-300'
                  : 'border-ivory-300 bg-ivory-50 hover:border-brand-400 hover:bg-brand-50 text-ink-primary'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`font-bold text-xs sm:text-sm ${isSelected ? 'text-white' : 'text-ink-primary'}`}>
                  {opt.label}
                </span>
                {isSelected && <Check className="w-4 h-4 text-white shrink-0" />}
              </div>
              <p className={`text-[10px] sm:text-[11px] leading-tight ${isSelected ? 'text-white/85' : 'text-ink-muted'}`}>
                {opt.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};


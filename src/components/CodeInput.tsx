import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface CodeInputProps {
  value: string[];
  onChange: (index: number, value: string) => void;
  onKeyDown: (index: number, e: React.KeyboardEvent) => void;
  length?: number;
  error?: string;
}

export default function CodeInput({ 
  value, 
  onChange, 
  onKeyDown, 
  length = 6,
  error
}: CodeInputProps) {
  const isComplete = value.every(v => v !== '');
  const showSuccess = isComplete && !error;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center gap-4">
        <div className="flex gap-2">
          {Array.from({ length }).map((_, index) => (
            <motion.input
              key={index}
              id={`code-${index}`}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={value[index]}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                onChange(index, val);
              }}
              onKeyDown={(e) => onKeyDown(index, e)}
              className={`w-12 h-12 text-center text-xl font-bold border rounded-lg transition-all ${
                error
                  ? 'border-red-300 focus:ring-red-100 focus:border-red-500 bg-red-50'
                  : showSuccess
                  ? 'border-green-300 focus:ring-green-100 focus:border-green-500 bg-green-50'
                  : 'border-gray-200 focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red'
              }`}
              required
            />
          ))}
        </div>
        
        <AnimatePresence>
          {(error || showSuccess) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center"
            >
              {error ? (
                <AlertCircle className="h-5 w-5 text-red-500" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="text-sm text-red-500 flex items-center justify-center gap-1"
          >
            <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
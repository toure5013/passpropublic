import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BackButtonProps {
  onClick?: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="mb-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 font-medium text-sm hover:bg-white transition-all duration-300 group flex items-center gap-2"
      aria-label="Retour"
    >
      <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform duration-300" />
      Retour
    </motion.button>
  );
}
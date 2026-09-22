'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const unfoldItem = {
  hidden: { opacity: 0, scale: 0.9, y: 24 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 260, damping: 22 },
  },
};

export const MotionSection = motion.section;
export const MotionDiv = motion.div;

export function Parallax({
  children,
  speed = 0.3,
  className = '',
}: {
  children?: React.ReactNode;
  speed?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${speed * -60}px`, `${speed * 60}px`]);
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
}

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#EF4444', '#EAB308'];

export const CelebrationEffects: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      const generated: Particle[] = Array.from({ length: 45 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 800,
        y: -100 - Math.random() * 400,
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        rotation: Math.random() * 720,
        delay: Math.random() * 0.3
      }));
      setParticles(generated);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden flex items-center justify-center">
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 1, scale: 0, x: 0, y: 0, rotate: 0 }}
            animate={{
              opacity: [1, 1, 0],
              scale: [0, 1.2, 0.8],
              x: p.x,
              y: [0, p.y * 0.6, 600],
              rotate: p.rotation
            }}
            transition={{
              duration: 2.8,
              delay: p.delay,
              ease: [0.25, 1, 0.5, 1]
            }}
            style={{
              position: 'absolute',
              width: p.size,
              height: p.size * 1.6,
              backgroundColor: p.color,
              borderRadius: 3
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

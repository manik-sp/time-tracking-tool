'use client'

import { motion } from 'framer-motion'

const MotionDiv = motion.create('div')

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </MotionDiv>
)


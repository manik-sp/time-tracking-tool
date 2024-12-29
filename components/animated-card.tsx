'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

const MotionDiv = motion.create('div')

export const AnimatedCard = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => (
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </MotionDiv>
)


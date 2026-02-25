import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  direction?: 'forward' | 'back'
}

const variants = {
  enter: (direction: string) => ({
    x: direction === 'back' ? '-100%' : '100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: string) => ({
    x: direction === 'back' ? '100%' : '-30%',
    opacity: 0,
  }),
}

export default function PageTransition({ children, direction = 'forward' }: Props) {
  return (
    <motion.div
      className="screen"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: 'spring', stiffness: 380, damping: 36 },
        opacity: { duration: 0.2 },
      }}
    >
      {children}
    </motion.div>
  )
}

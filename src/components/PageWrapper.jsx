import { motion } from 'framer-motion';

const variants = {
  initial:  { opacity: 0, x: 32 },
  animate:  { opacity: 1, x: 0,  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  exit:     { opacity: 0, x: -24, transition: { duration: 0.3,  ease: [0.55, 0, 1, 0.45] } },
};

export default function PageWrapper({ children }) {
  return (
    <motion.div variants={variants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

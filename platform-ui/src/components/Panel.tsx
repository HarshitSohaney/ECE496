import { motion } from 'framer-motion';

interface PanelProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const Panel: React.FC<PanelProps> = ({ isOpen, children }) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: isOpen ? '300px' : '0px' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        overflow: 'hidden',
        padding: isOpen ? 'var(--mantine-spacing-md)' : 0,
        color: 'var(--mantine-color-dark-0)',
        fontSize: '14px',
        height: '100vh',
      }}
    >
      {isOpen && children}
    </motion.div>
  );
};

export default Panel;

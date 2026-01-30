import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, FileText, BookOpen, Clock, Settings, 
  Home, ChevronRight, Plus, Trash2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
}

export const Sidebar = ({ isOpen, onClose, onNavigate }: SidebarProps) => {
  const menuItems = [
    { id: 'home', icon: Home, label: 'Inicio', action: () => onNavigate('home') },
    { id: 'examples', icon: BookOpen, label: 'Base de Ejemplos', action: () => onNavigate('examples') },
    { id: 'projects', icon: Clock, label: 'Proyectos Pasados', action: () => onNavigate('projects') },
    { id: 'settings', icon: Settings, label: 'Configuración', action: () => onNavigate('settings') },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-sidebar z-50 flex flex-col safe-area-top safe-area-bottom"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-sidebar-foreground">Transcriptor</h1>
                  <p className="text-xs text-muted-foreground">Para Redactores</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    item.action();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-sidebar-accent transition-colors group"
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-sidebar-primary transition-colors" />
                  <span className="flex-1 text-left text-sidebar-foreground">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              ))}
            </nav>

            {/* Footer info */}
            <div className="p-4 border-t border-sidebar-border">
              <p className="text-xs text-muted-foreground text-center">
                Proyectos se eliminan automáticamente después de 2 semanas
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export const SidebarTrigger = ({ onClick }: { onClick: () => void }) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className="rounded-full"
  >
    <Menu className="w-6 h-6" />
  </Button>
);

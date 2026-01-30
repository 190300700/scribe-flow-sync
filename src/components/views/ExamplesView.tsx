import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, BookOpen, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Example } from '@/types';

interface ExamplesViewProps {
  onBack: () => void;
}

export const ExamplesView = ({ onBack }: ExamplesViewProps) => {
  const [examples, setExamples] = useState<Example[]>([
    {
      id: '1',
      contentText: 'El presidente anunció hoy nuevas medidas económicas que incluyen la reducción de impuestos para pequeñas empresas. La medida entrará en vigor el próximo mes.',
      createdAt: new Date(),
    },
    {
      id: '2',
      contentText: 'Un sismo de magnitud 5.2 sacudió la región central del país esta madrugada. Las autoridades reportan que no hubo víctimas ni daños materiales significativos.',
      createdAt: new Date(),
    },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newExample, setNewExample] = useState('');

  const handleAdd = () => {
    if (newExample.trim()) {
      setExamples([
        ...examples,
        {
          id: Date.now().toString(),
          contentText: newExample.trim(),
          createdAt: new Date(),
        },
      ]);
      setNewExample('');
      setIsAdding(false);
    }
  };

  const handleDelete = (id: string) => {
    setExamples(examples.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col safe-area-top safe-area-bottom">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b border-border">
        <Button
          variant="ghost"
          onClick={onBack}
          className="rounded-full"
        >
          ← Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Base de Ejemplos</h1>
          <p className="text-xs text-muted-foreground">
            Usados para procesar noticieros
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-4 overflow-auto scrollbar-thin pb-24">
        {examples.length === 0 && !isAdding ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-foreground font-medium mb-2">Sin ejemplos</p>
            <p className="text-sm text-muted-foreground mb-6">
              Agrega ejemplos de notas para mejorar el procesamiento editorial
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {examples.map((example, index) => (
                <motion.div
                  key={example.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="card-gradient p-4"
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <FileText className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(example.id)}
                        className="shrink-0 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {example.contentText}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3">
                      Agregado el {example.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add new example form */}
            <AnimatePresence>
              {isAdding && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="card-gradient p-4"
                >
                  <div className="relative z-10 space-y-4">
                    <Textarea
                      value={newExample}
                      onChange={(e) => setNewExample(e.target.value)}
                      placeholder="Pega aquí un ejemplo de nota final (solo texto)..."
                      className="min-h-[120px] bg-background border-border resize-none"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAdd}
                        className="flex-1 btn-gradient-primary"
                        disabled={!newExample.trim()}
                      >
                        Guardar ejemplo
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAdding(false);
                          setNewExample('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Add button */}
      {!isAdding && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 p-4 glass safe-area-bottom"
        >
          <Button
            onClick={() => setIsAdding(true)}
            className="w-full btn-gradient-primary h-14 text-lg rounded-xl"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agregar ejemplo
          </Button>
        </motion.div>
      )}
    </div>
  );
};

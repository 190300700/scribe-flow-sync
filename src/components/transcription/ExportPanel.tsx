import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Download, Check, MessageCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranscriptionStore } from '@/store/transcriptionStore';
import { useToast } from '@/hooks/use-toast';

export const ExportPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentProject } = useTranscriptionStore();
  const { toast } = useToast();

  const textToExport = currentProject?.processedText || currentProject?.rawText || '';

  // Format text for WhatsApp
  const formatForWhatsApp = (text: string) => {
    // Add proper line breaks and formatting for WhatsApp readability
    return text
      .replace(/##\s*(\w+)/g, '*[?? $1]*') // Bold unknown words
      .replace(/#([^#]+)#/g, '_[$1]_') // Italicize timestamps
      .replace(/^(Personaje\s*\d+|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+):/gm, '*$1:*') // Bold speakers
      .split('\n')
      .filter(line => line.trim())
      .join('\n\n'); // Double line breaks for readability
  };

  const handleCopy = async () => {
    const formatted = formatForWhatsApp(textToExport);
    await navigator.clipboard.writeText(formatted);
    setCopied(true);
    toast({
      title: "Copiado al portapapeles",
      description: "Texto optimizado para WhatsApp",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([textToExport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcripcion-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Archivo descargado",
      description: "Transcripción guardada como .txt",
    });
  };

  if (!textToExport) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-28 right-4"
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="mb-2 glass rounded-2xl p-2 flex flex-col gap-2"
          >
            <Button
              onClick={handleCopy}
              variant="ghost"
              className="justify-start gap-3 h-12 px-4 hover:bg-success/10"
            >
              {copied ? (
                <Check className="w-5 h-5 text-success" />
              ) : (
                <MessageCircle className="w-5 h-5 text-success" />
              )}
              <span>Copiar para WhatsApp</span>
            </Button>

            <Button
              onClick={handleDownload}
              variant="ghost"
              className="justify-start gap-3 h-12 px-4"
            >
              <Download className="w-5 h-5" />
              <span>Descargar .txt</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`btn-gradient-primary w-14 h-14 rounded-full p-0 ${isOpen ? 'rotate-180' : ''} transition-transform`}
      >
        {isOpen ? (
          <ChevronDown className="w-6 h-6" />
        ) : (
          <Copy className="w-6 h-6" />
        )}
      </Button>
    </motion.div>
  );
};

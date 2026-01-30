import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranscriptionStore } from '@/store/transcriptionStore';

export const TranscriptionEditor = () => {
  const { currentProject, updateRawText, type } = useTranscriptionStore();
  const [localText, setLocalText] = useState(currentProject?.rawText || '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLocalText(currentProject?.rawText || '');
  }, [currentProject?.rawText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setLocalText(newText);
    updateRawText(newText);
  };

  // Format text with visual highlights for placeholders
  const renderFormattedText = () => {
    if (!localText) {
      return (
        <p className="text-muted-foreground italic">
          {type === 'interview' 
            ? 'La transcripción aparecerá aquí. Los hablantes y palabras desconocidas serán marcados automáticamente.'
            : 'Presiona el botón verde para iniciar una nota y el rojo para finalizarla.'
          }
        </p>
      );
    }

    // This would be replaced with actual formatting logic
    return localText.split('\n').map((line, index) => (
      <p key={index} className="mb-2">
        {formatLine(line)}
      </p>
    ));
  };

  const formatLine = (line: string) => {
    // Format placeholders and speakers
    const parts = [];
    let remaining = line;
    let key = 0;

    // Match ## word patterns (unknown words)
    const unknownWordRegex = /##\s*(\w+)/g;
    // Match #Minuto X:XX# patterns
    const timestampRegex = /#Minuto\s*(\d+:\d+)[^#]*#/g;
    // Match speaker patterns like "Juan:" or "Personaje 1:"
    const speakerRegex = /^((?:Personaje\s*\d+|[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)):/;

    let match;
    let lastIndex = 0;

    // Simple implementation - would be more robust in production
    const speakerMatch = remaining.match(speakerRegex);
    if (speakerMatch) {
      parts.push(
        <span key={key++} className="transcription-speaker">
          {speakerMatch[1]}:
        </span>
      );
      remaining = remaining.substring(speakerMatch[0].length);
    }

    // Check for unknown words
    remaining = remaining.replace(/##\s*(\w+)/g, (match, word) => {
      return `<placeholder>${word}</placeholder>`;
    });

    // Check for timestamps
    remaining = remaining.replace(/#([^#]+)#/g, (match, content) => {
      return `<timestamp>${content}</timestamp>`;
    });

    // Parse the remaining text with our custom tags
    const segments = remaining.split(/(<placeholder>.*?<\/placeholder>|<timestamp>.*?<\/timestamp>)/);
    
    segments.forEach((segment, i) => {
      if (segment.startsWith('<placeholder>')) {
        const content = segment.replace(/<\/?placeholder>/g, '');
        parts.push(
          <span key={key++} className="transcription-placeholder">
            ## {content}
          </span>
        );
      } else if (segment.startsWith('<timestamp>')) {
        const content = segment.replace(/<\/?timestamp>/g, '');
        parts.push(
          <span key={key++} className="transcription-timestamp">
            #{content}#
          </span>
        );
      } else {
        parts.push(<span key={key++}>{segment}</span>);
      }
    });

    return parts;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 p-4 overflow-auto scrollbar-thin"
    >
      <div className="max-w-2xl mx-auto">
        {/* View mode with formatting */}
        <div className="transcription-text min-h-[200px] p-4 rounded-xl bg-card/50 border border-border">
          {renderFormattedText()}
        </div>

        {/* Edit mode (always available) */}
        <div className="mt-4">
          <label className="text-xs text-muted-foreground mb-2 block">
            Editar texto (tiempo real)
          </label>
          <textarea
            ref={textareaRef}
            value={localText}
            onChange={handleChange}
            placeholder="Escribe o edita la transcripción aquí..."
            className="w-full min-h-[150px] p-4 bg-secondary/50 border border-border rounded-xl 
                       font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary
                       scrollbar-thin"
          />
        </div>
      </div>
    </motion.div>
  );
};

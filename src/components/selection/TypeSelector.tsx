import { motion } from 'framer-motion';
import { Users, Radio } from 'lucide-react';
import { TranscriptionType } from '@/types';
import { useTranscriptionStore } from '@/store/transcriptionStore';

interface TypeCardProps {
  type: TranscriptionType;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
}

const TypeCard = ({ title, description, features, icon, isSelected, onClick }: TypeCardProps) => (
  <motion.button
    onClick={onClick}
    className={`selection-card w-full text-left ${isSelected ? 'selected' : ''}`}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: 0.1 }}
  >
    <div className="relative z-10">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-xl ${isSelected ? 'bg-primary/30' : 'bg-secondary'} transition-colors`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className={`w-5 h-5 rounded-full border-2 ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'} transition-all flex items-center justify-center`}>
          {isSelected && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-2 h-2 bg-primary-foreground rounded-full"
            />
          )}
        </div>
      </div>
      
      <ul className="space-y-2 ml-[60px]">
        {features.map((feature, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="flex items-center gap-2 text-xs text-muted-foreground"
          >
            <span className="w-1 h-1 rounded-full bg-primary" />
            {feature}
          </motion.li>
        ))}
      </ul>
    </div>
  </motion.button>
);

export const TypeSelector = () => {
  const { type, setType } = useTranscriptionStore();

  return (
    <div className="space-y-4">
      <motion.h2 
        className="text-2xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-gradient">¿Qué vas a transcribir?</span>
      </motion.h2>
      
      <TypeCard
        type="interview"
        title="Entrevista"
        description="Transcripción literal sin parafraseo"
        features={[
          "Identificación colaborativa de hablantes",
          "Placeholders con minuto exacto",
          "Texto crudo y fiel al audio"
        ]}
        icon={<Users className="w-6 h-6 text-primary" />}
        isSelected={type === 'interview'}
        onClick={() => setType('interview')}
      />
      
      <TypeCard
        type="news"
        title="Noticiero"
        description="Segmentación y procesamiento editorial"
        features={[
          "Segmentación de notas con botones",
          "Procesamiento basado en ejemplos",
          "Resumen estructurado por nota"
        ]}
        icon={<Radio className="w-6 h-6 text-accent" />}
        isSelected={type === 'news'}
        onClick={() => setType('news')}
      />
    </div>
  );
};

/**
 * Generates a simulated but coherent interview transcription
 * Following the exact placeholder format specified:
 * - Unknown words: ##texto_inaudible #Minuto mm:ss del audio#
 * - Unidentified speakers: #Definir personaje del minuto mm:ss#
 */

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const generateMockTranscription = (fileName: string): string => {
  const transcription = `#Definir personaje del minuto 0:00#
Buenos días, gracias por aceptar esta entrevista. Vamos a hablar sobre el proyecto que están desarrollando actualmente.

Entrevistado:
Por supuesto, es un placer estar aquí. El proyecto ha sido un trabajo de varios meses y estamos muy emocionados de compartir los avances.

#Definir personaje del minuto 0:45#
¿Podría contarnos un poco sobre los objetivos principales del proyecto?

Entrevistado:
Claro. El objetivo principal es ##texto_inaudible #Minuto 1:02 del audio# mejorar la accesibilidad de los servicios para todas las comunidades. Hemos trabajado con diferentes equipos para asegurar que la solución sea integral.

#Definir personaje del minuto 1:30#
Mencionó la palabra accesibilidad. ¿Qué significa eso en el contexto de su trabajo?

Entrevistado:
Significa que cualquier persona, sin importar su ubicación o situación económica, pueda ##texto_inaudible #Minuto 1:52 del audio# acceder a estos recursos de manera gratuita y sin complicaciones.

#Definir personaje del minuto 2:15#
¿Cuáles han sido los mayores desafíos hasta ahora?

Entrevistado:
Los desafíos han sido principalmente técnicos. Integrar sistemas que no estaban diseñados para trabajar juntos requiere mucha coordinación. También hemos enfrentado ##texto_inaudible #Minuto 2:45 del audio# pero el equipo ha respondido de manera excepcional.

#Definir personaje del minuto 3:00#
¿Cuál es el cronograma previsto para el lanzamiento?

Entrevistado:
Esperamos lanzar la primera fase en los próximos tres meses. La segunda fase incluirá características adicionales que estamos ##texto_inaudible #Minuto 3:28 del audio# desarrollando en paralelo.

#Definir personaje del minuto 3:45#
Muchas gracias por su tiempo. ¿Algún mensaje final para nuestra audiencia?

Entrevistado:
Solo agradecer el interés y recordarles que este proyecto es para beneficio de todos. Los invitamos a seguir nuestras actualizaciones y a ##texto_inaudible #Minuto 4:10 del audio# participar activamente cuando estemos listos para las pruebas públicas.

#Definir personaje del minuto 4:25#
Gracias nuevamente. Ha sido una conversación muy informativa.

Entrevistado:
Gracias a ustedes por el espacio.`;

  return transcription;
};

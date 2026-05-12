import { motion } from "motion/react";

export function VoiceWave({ isSpeaking, color = "bg-blue-500" }: { isSpeaking: boolean; color?: string }) {
  return (
    <div className="flex items-center justify-center gap-1 h-32">
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`w-1 rounded-full ${color}`}
          animate={{
            height: isSpeaking ? [20, Math.random() * 80 + 20, 20] : 10,
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            delay: i * 0.05,
            ease: "easeInOut",
          }}
          style={{
            opacity: 0.3 + (i / 20) * 0.7,
          }}
        />
      ))}
    </div>
  );
}


import React from "react";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import Game from "@/components/Game";
import Menu from "@/components/Menu";

function App() {
  const [gameStarted, setGameStarted] = React.useState(false);
  const [difficulty, setDifficulty] = React.useState(null);
  const { toast } = useToast();

  const handleStartGame = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
    setGameStarted(true);
    toast({
      title: "Jogo iniciado!",
      description: `Dificuldade selecionada: ${selectedDifficulty}`,
    });
  };

  const handleBackToMenu = () => {
    setGameStarted(false);
    setDifficulty(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <motion.h1 
          className="text-4xl font-bold text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Jogo de Damas
        </motion.h1>

        {!gameStarted ? (
          <Menu onStartGame={handleStartGame} />
        ) : (
          <Game difficulty={difficulty} onBackToMenu={handleBackToMenu} />
        )}

        <footer className="fixed bottom-0 left-0 right-0 text-center py-4 text-gray-400 bg-gray-900 bg-opacity-80">
          © 2025 Rennan Alves. Todos os direitos reservados.
        </footer>
      </div>
      <Toaster />
    </div>
  );
}

export default App;

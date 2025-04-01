import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const difficulties = [
  { id: "easy", label: "Fácil", color: "bg-green-600 hover:bg-green-700" },
  { id: "medium", label: "Médio", color: "bg-yellow-600 hover:bg-yellow-700" },
  { id: "hard", label: "Difícil", color: "bg-red-600 hover:bg-red-700" },
];

function Menu({ onStartGame }) {
  return (
    <motion.div 
      className="max-w-md mx-auto bg-gray-800 rounded-lg p-8 shadow-lg"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-2xl font-semibold text-center mb-6">Escolha a Dificuldade</h2>
      <div className="space-y-4">
        {difficulties.map((diff) => (
          <motion.div
            key={diff.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              className={`w-full text-lg py-6 ${diff.color}`}
              onClick={() => onStartGame(diff.label)}
            >
              {diff.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default Menu;
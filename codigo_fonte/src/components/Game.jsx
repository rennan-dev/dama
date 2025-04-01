import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const BOARD_SIZE = 8;
const INITIAL_BOARD = Array(BOARD_SIZE).fill().map((_, row) => 
  Array(BOARD_SIZE).fill().map((_, col) => {
    if (row < 3 && (row + col) % 2 === 1) return "black";
    if (row > 4 && (row + col) % 2 === 1) return "red";
    return null;
  })
);

function Game({ difficulty, onBackToMenu }) {
  const [board, setBoard] = React.useState(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = React.useState(null);
  const [currentPlayer, setCurrentPlayer] = React.useState("red");
  const [validMoves, setValidMoves] = React.useState([]);
  const { toast } = useToast();

  const findValidMoves = (row, col, isJumpMove = false) => {
    const piece = board[row][col];
    if (!piece) return [];

    const moves = [];
    const directions = piece.includes("red") ? [-1] : [1];
    
    //adiciona movimento para trás para peças que se tornaram damas
    if (piece.includes("king")) {
      directions.push(piece.includes("red") ? 1 : -1);
    }

    directions.forEach(rowDir => {
      [-1, 1].forEach(colDir => {
        const newRow = row + rowDir;
        const newCol = col + colDir;
        
        if (isValidPosition(newRow, newCol)) {
          //movimento normal
          if (!isJumpMove && !board[newRow][newCol]) {
            moves.push({ type: "move", to: { row: newRow, col: newCol } });
          }
          //captura
          else if (board[newRow][newCol] && isOpponentPiece(piece, board[newRow][newCol])) {
            const jumpRow = newRow + rowDir;
            const jumpCol = newCol + colDir;
            
            if (isValidPosition(jumpRow, jumpCol) && !board[jumpRow][jumpCol]) {
              moves.push({
                type: "capture",
                to: { row: jumpRow, col: jumpCol },
                capture: { row: newRow, col: newCol }
              });
            }
          }
        }
      });
    });

    //se houver capturas disponíveis, retorna apenas as capturas
    const captureMoves = moves.filter(move => move.type === "capture");
    return captureMoves.length > 0 ? captureMoves : moves;
  };

  const isValidPosition = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  const isOpponentPiece = (currentPiece, targetPiece) => {
    return currentPiece.includes("red") !== targetPiece.includes("red");
  };

  const handlePieceClick = (row, col) => {
    //previne movimentos durante o turno do computador
    if (currentPlayer === "black") return;

    const piece = board[row][col];
    
    //se já houver uma peça selecionada, tenta mover
    if (selectedPiece) {
      const move = validMoves.find(m => m.to.row === row && m.to.col === col);
      if (move) {
        executeMove(move);
      } else {
        //se clicou em outra peça própria, seleciona ela
        if (piece && piece.includes(currentPlayer)) {
          const moves = findValidMoves(row, col);
          setSelectedPiece({ row, col });
          setValidMoves(moves);
        } else {
          //se clicou em um espaço inválido, deseleciona
          setSelectedPiece(null);
          setValidMoves([]);
        }
      }
      return;
    }

    //seleciona nova peça
    if (piece && piece.includes(currentPlayer)) {
      const moves = findValidMoves(row, col);
      if (moves.length > 0) {
        setSelectedPiece({ row, col });
        setValidMoves(moves);
      }
    }
  };

  const executeMove = (move) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[selectedPiece.row][selectedPiece.col];
    
    //remove a peça da posição original
    newBoard[selectedPiece.row][selectedPiece.col] = null;
    
    //se for uma captura, remove a peça capturada
    if (move.type === "capture") {
      newBoard[move.capture.row][move.capture.col] = null;
      toast({
        title: "Peça capturada!",
        description: `${currentPlayer === "red" ? "Vermelho" : "Preto"} capturou uma peça`,
      });
    }

    //verifica se a peça deve se tornar uma dama
    let newPiece = piece;
    if ((currentPlayer === "red" && move.to.row === 0) || 
        (currentPlayer === "black" && move.to.row === BOARD_SIZE - 1)) {
      newPiece = `${currentPlayer}-king`;
      toast({
        title: "Dama!",
        description: `Uma peça foi promovida a dama!`,
      });
    }

    //coloca a peça na nova posição
    newBoard[move.to.row][move.to.col] = newPiece;
    
    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    //verifica se há mais capturas disponíveis para a mesma peça
    if (move.type === "capture") {
      const moreCapturesAvailable = findValidMoves(move.to.row, move.to.col, true)
        .filter(m => m.type === "capture").length > 0;

      if (moreCapturesAvailable) {
        setSelectedPiece({ row: move.to.row, col: move.to.col });
        setValidMoves(findValidMoves(move.to.row, move.to.col, true));
        return;
      }
    }

    //troca o turno
    setCurrentPlayer("black");
    //setTimeout(computerMove, 1000);
  };

  const computerMove = () => {
    //array para armazenar todos os movimentos possíveis
    const allMoves = [];
    
    //primeiro, procura por todas as peças pretas e seus movimentos possíveis
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if (board[i][j]?.includes("black")) {
          const moves = findValidMoves(i, j);
          moves.forEach(move => {
            allMoves.push({
              ...move,
              from: { row: i, col: j }
            });
          });
        }
      }
    }

    //se não houver movimentos possíveis, o jogo acabou
    if (allMoves.length === 0) {
      toast({
        title: "Fim de jogo!",
        description: "Não há mais movimentos possíveis para o computador.",
      });
      return;
    }

    //filtra primeiro as capturas, se houver
    const captureMoves = allMoves.filter(move => move.type === "capture");
    
    //escolhe um movimento baseado na dificuldade
    let selectedMove;
    if (captureMoves.length > 0) {
      //se houver capturas, escolhe uma delas aleatoriamente
      selectedMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    } else {
      //se não houver capturas, escolhe um movimento normal
      //a probabilidade de escolher o melhor movimento depende da dificuldade
      const difficultyFactor = {
        "Fácil": 0.3,
        "Médio": 0.6,
        "Difícil": 0.9
      }[difficulty];

      //ordena os movimentos por "qualidade" (mais próximo do fim do tabuleiro é melhor)
      const sortedMoves = allMoves.sort((a, b) => b.to.row - a.to.row);
      
      //escolhe um movimento baseado na dificuldade
      const moveIndex = Math.floor(Math.random() * sortedMoves.length * (1 - difficultyFactor));
      selectedMove = sortedMoves[moveIndex];
    }

    //executa o movimento escolhido
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[selectedMove.from.row][selectedMove.from.col];
    
    //remove a peça da posição original
    newBoard[selectedMove.from.row][selectedMove.from.col] = null;
    
    //se for uma captura, remove a peça capturada
    if (selectedMove.type === "capture") {
      newBoard[selectedMove.capture.row][selectedMove.capture.col] = null;
      toast({
        title: "Peça capturada!",
        description: "O computador capturou uma peça",
      });
    }

    //verifica se a peça deve se tornar uma dama
    if (selectedMove.to.row === BOARD_SIZE - 1) {
      newBoard[selectedMove.to.row][selectedMove.to.col] = "black-king";
      toast({
        title: "Dama!",
        description: "Uma peça do computador virou dama!",
      });
    } else {
      newBoard[selectedMove.to.row][selectedMove.to.col] = piece;
    }

    //atualiza o tabuleiro e passa a vez
    setBoard(newBoard);
    setCurrentPlayer("red");
  };

  React.useEffect(() => {
    if (currentPlayer === "black") {
      setTimeout(computerMove, 1000);
    }
  }, [currentPlayer]);
  

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={onBackToMenu}
          className="text-white"
        >
          Voltar ao Menu
        </Button>
        <div className="text-xl font-semibold">
          Dificuldade: {difficulty}
        </div>
      </div>

      <motion.div 
        className="grid grid-cols-8 gap-1 bg-gray-700 p-4 rounded-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => {
            const isValidMove = validMoves.some(
              move => move.to.row === rowIndex && move.to.col === colIndex
            );

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square rounded-lg cursor-pointer relative
                  ${(rowIndex + colIndex) % 2 === 0 ? 'bg-gray-400' : 'bg-gray-800'}
                  ${selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'ring-2 ring-yellow-400' : ''}
                  ${isValidMove ? 'ring-2 ring-green-400' : ''}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePieceClick(rowIndex, colIndex)}
              >
                {cell && (
                  <motion.div
                    className={`
                      w-full h-full rounded-full flex items-center justify-center
                      ${cell.includes('red') ? 'bg-red-500' : 'bg-gray-900'}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {cell.includes('king') && (
                      <div className="w-1/2 h-1/2 rounded-full bg-yellow-400" />
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })
        ))}
      </motion.div>

      <div className="mt-4 text-center text-lg">
        Vez do jogador: {currentPlayer === "red" ? "Vermelho" : "Preto"}
      </div>
    </div>
  );
}

export default Game;
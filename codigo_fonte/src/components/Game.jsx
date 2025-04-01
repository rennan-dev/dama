import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const BOARD_SIZE = 8;
const INITIAL_BOARD = Array(BOARD_SIZE)
  .fill()
  .map((_, row) =>
    Array(BOARD_SIZE)
      .fill()
      .map((_, col) => {
        if(row < 3 && (row + col) % 2 === 1) return "black";
        if(row > 4 && (row + col) % 2 === 1) return "red";
        return null;
      })
  );

function Game({ difficulty, onBackToMenu }) {
  const [board, setBoard] = React.useState(INITIAL_BOARD);
  const [selectedPiece, setSelectedPiece] = React.useState(null);
  const [currentPlayer, setCurrentPlayer] = React.useState("red");
  const [validMoves, setValidMoves] = React.useState([]);
  const { toast } = useToast();

  //função para verificar se a posição é válida
  const isValidPosition = (row, col) => {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
  };

  //verifica se a peça alvo é adversária
  const isOpponentPiece = (currentPiece, targetPiece) => {
    return currentPiece.includes("red") !== targetPiece.includes("red");
  };

  //lógica para peças normais e para damas é diferenciada
  function findValidMoves(row, col, isJumpMove = false) {
    const piece = board[row][col];
    if(!piece) return [];

    //se for dama, usa a lógica específica
    if(piece.includes("king")) {
      return findQueenMoves(row, col, isJumpMove);
    }

    //para peças normais: movimento e captura apenas para frente
    const moveDirections = piece.includes("red") ? [-1] : [1];
    const captureDirections = moveDirections; //captura apenas para frente

    const moves = [];
    let foundCapture = false;

    //verifica capturas
    captureDirections.forEach((rowDir) => {
      [-1, 1].forEach((colDir) => {
        const newRow = row + rowDir;
        const newCol = col + colDir;

        if(isValidPosition(newRow, newCol)) {
          if(board[newRow][newCol] && isOpponentPiece(piece, board[newRow][newCol])) {
            const jumpRow = newRow + rowDir;
            const jumpCol = newCol + colDir;
            if(isValidPosition(jumpRow, jumpCol) && !board[jumpRow][jumpCol]) {
              foundCapture = true;
              moves.push({
                type: "capture",
                to: { row: jumpRow, col: jumpCol },
                capture: { row: newRow, col: newCol },
              });
            }
          }
        }
      });
    });

    if(foundCapture) {
      return moves;
    }

    //se não estiver em sequência de captura, checa movimentos normais
    if(!isJumpMove) {
      moveDirections.forEach((rowDir) => {
        [-1, 1].forEach((colDir) => {
          const newRow = row + rowDir;
          const newCol = col + colDir;
          if(isValidPosition(newRow, newCol) && !board[newRow][newCol]) {
            moves.push({ type: "move", to: { row: newRow, col: newCol } });
          }
        });
      });
    }

    return moves;
  }

  //lógica para a Dama (queen) – movimento livre em diagonal e captura à distância
  function findQueenMoves(row, col, isJumpMove = false) {
    const piece = board[row][col];
    if(!piece) return [];

    const moves = [];
    const directions = [
      { rowDir: 1, colDir: 1 },
      { rowDir: 1, colDir: -1 },
      { rowDir: -1, colDir: 1 },
      { rowDir: -1, colDir: -1 },
    ];

    let foundCapture = false;

    directions.forEach(({ rowDir, colDir }) => {
      let r = row + rowDir;
      let c = col + colDir;
      let enemyFound = false;
      let enemyPos = null;

      while (isValidPosition(r, c)) {
        if(board[r][c]) {
          if(!enemyFound && isOpponentPiece(piece, board[r][c])) {
            enemyFound = true;
            enemyPos = { row: r, col: c };
          }else {
            break;
          }
        }else {
          if(enemyFound) {
            foundCapture = true;
            moves.push({
              type: "capture",
              to: { row: r, col: c },
              capture: enemyPos,
            });
          }else if(!isJumpMove) {
            moves.push({
              type: "move",
              to: { row: r, col: c },
            });
          }
        }
        r += rowDir;
        c += colDir;
      }
    });

    if(foundCapture) {
      return moves.filter((m) => m.type === "capture");
    }
    return moves;
  }

  //versão da função que recebe um board como parâmetro (para capturas em cadeia)
  function findValidMovesOnBoard(theBoard, row, col, isJumpMove = false) {
    const piece = theBoard[row][col];
    if(!piece) return [];

    if(piece.includes("king")) {
      return findQueenMovesOnBoard(theBoard, row, col, isJumpMove);
    }

    const moveDirections = piece.includes("red") ? [-1] : [1];
    const captureDirections = moveDirections;

    const moves = [];
    let foundCapture = false;

    captureDirections.forEach((rowDir) => {
      [-1, 1].forEach((colDir) => {
        const newRow = row + rowDir;
        const newCol = col + colDir;

        if(isValidPosition(newRow, newCol)) {
          if(theBoard[newRow][newCol] && isOpponentPiece(piece, theBoard[newRow][newCol])) {
            const jumpRow = newRow + rowDir;
            const jumpCol = newCol + colDir;
            if(isValidPosition(jumpRow, jumpCol) && !theBoard[jumpRow][jumpCol]) {
              foundCapture = true;
              moves.push({
                type: "capture",
                to: { row: jumpRow, col: jumpCol },
                capture: { row: newRow, col: newCol },
              });
            }
          }
        }
      });
    });

    if(foundCapture) {
      return moves;
    }

    if(!isJumpMove) {
      moveDirections.forEach((rowDir) => {
        [-1, 1].forEach((colDir) => {
          const newRow = row + rowDir;
          const newCol = col + colDir;
          if(isValidPosition(newRow, newCol) && !theBoard[newRow][newCol]) {
            moves.push({ type: "move", to: { row: newRow, col: newCol } });
          }
        });
      });
    }

    return moves;
  }

  //versão para a Dama que recebe o board
  function findQueenMovesOnBoard(theBoard, row, col, isJumpMove = false) {
    const piece = theBoard[row][col];
    if(!piece) return [];

    const moves = [];
    const directions = [
      { rowDir: 1, colDir: 1 },
      { rowDir: 1, colDir: -1 },
      { rowDir: -1, colDir: 1 },
      { rowDir: -1, colDir: -1 },
    ];

    let foundCapture = false;

    directions.forEach(({ rowDir, colDir }) => {
      let r = row + rowDir;
      let c = col + colDir;
      let enemyFound = false;
      let enemyPos = null;

      while (isValidPosition(r, c)) {
        if(theBoard[r][c]) {
          if(!enemyFound && isOpponentPiece(piece, theBoard[r][c])) {
            enemyFound = true;
            enemyPos = { row: r, col: c };
          }else {
            break;
          }
        }else {
          if(enemyFound) {
            foundCapture = true;
            moves.push({
              type: "capture",
              to: { row: r, col: c },
              capture: enemyPos,
            });
          }else if(!isJumpMove) {
            moves.push({
              type: "move",
              to: { row: r, col: c },
            });
          }
        }
        r += rowDir;
        c += colDir;
      }
    });

    if(foundCapture) {
      return moves.filter((m) => m.type === "capture");
    }
    return moves;
  }

  const handlePieceClick = (row, col) => {
    //previna movimentos durante o turno do computador
    if(currentPlayer === "black") return;

    const piece = board[row][col];

    //se já houver peça selecionada, tenta mover
    if(selectedPiece) {
      const move = validMoves.find(
        (m) => m.to.row === row && m.to.col === col
      );
      if(move) {
        executeMove(move);
      }else {
        //se clicar em outra peça própria, seleciona ela
        if(piece && piece.includes(currentPlayer)) {
          const moves = findValidMoves(row, col);
          setSelectedPiece({ row, col });
          setValidMoves(moves);
        }else {
          //se clicar em espaço inválido, deseleciona
          setSelectedPiece(null);
          setValidMoves([]);
        }
      }
      return;
    }

    //seleciona nova peça
    if(piece && piece.includes(currentPlayer)) {
      const moves = findValidMoves(row, col);
      if(moves.length > 0) {
        setSelectedPiece({ row, col });
        setValidMoves(moves);
      }
    }
  };

  const executeMove = (move) => {
    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[selectedPiece.row][selectedPiece.col];

    //remove a peça da posição original
    newBoard[selectedPiece.row][selectedPiece.col] = null;

    //se for captura, remove a peça capturada
    if(move.type === "capture") {
      newBoard[move.capture.row][move.capture.col] = null;
      toast({
        title: "Peça capturada!",
        description: `${
          currentPlayer === "red" ? "Vermelho" : "Preto"
        } capturou uma peça`,
      });
    }

    //verifica promoção para dama
    let newPiece = piece;
    if(
      (currentPlayer === "red" && move.to.row === 0) ||
      (currentPlayer === "black" && move.to.row === BOARD_SIZE - 1)
    ) {
      newPiece = `${currentPlayer}-king`;
      toast({
        title: "Dama!",
        description: `Uma peça foi promovida a dama!`,
      });
    }

    //coloca a peça na nova posição
    newBoard[move.to.row][move.to.col] = newPiece;

    //antes de atualizar o board, verifica se há mais capturas em cadeia
    if(move.type === "capture") {
      const possibleMoves = findValidMovesOnBoard(newBoard, move.to.row, move.to.col, true);
      const moreCapturesAvailable = possibleMoves.some((m) => m.type === "capture");

      if(moreCapturesAvailable) {
        setBoard(newBoard);
        setSelectedPiece({ row: move.to.row, col: move.to.col });
        setValidMoves(possibleMoves);
        return;
      }
    }

    setBoard(newBoard);
    setSelectedPiece(null);
    setValidMoves([]);

    //troca o turno
    setCurrentPlayer(currentPlayer === "red" ? "black" : "red");
  };

  const computerMove = () => {
    //armazena todos os movimentos possíveis para o computador
    const allMoves = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if(board[i][j]?.includes("black")) {
          const moves = findValidMoves(i, j);
          moves.forEach((move) => {
            allMoves.push({
              ...move,
              from: { row: i, col: j },
            });
          });
        }
      }
    }

    //se não houver movimentos, o jogo acabou
    if(allMoves.length === 0) {
      toast({
        title: "Fim de Jogo!",
        description: "O computador não possui movimentos. Você venceu!",
      });
      setTimeout(() => onBackToMenu(), 3000);
      return;
    }

    //filtra capturas se houver
    const captureMoves = allMoves.filter((move) => move.type === "capture");

    let selectedMove;
    if(captureMoves.length > 0) {
      selectedMove = captureMoves[Math.floor(Math.random() * captureMoves.length)];
    }else {
      const difficultyFactor = {
        "Fácil": 0.3,
        "Médio": 0.6,
        "Difícil": 0.9,
      }[difficulty];

      const sortedMoves = allMoves.sort((a, b) => b.to.row - a.to.row);
      const moveIndex = Math.floor(Math.random() * sortedMoves.length * (1 - difficultyFactor));
      selectedMove = sortedMoves[moveIndex];
    }

    const newBoard = board.map((row) => [...row]);
    const piece = newBoard[selectedMove.from.row][selectedMove.from.col];

    newBoard[selectedMove.from.row][selectedMove.from.col] = null;

    if(selectedMove.type === "capture") {
      newBoard[selectedMove.capture.row][selectedMove.capture.col] = null;
      toast({
        title: "Peça capturada!",
        description: "O computador capturou uma peça",
      });
    }

    if(selectedMove.to.row === BOARD_SIZE - 1) {
      newBoard[selectedMove.to.row][selectedMove.to.col] = "black-king";
      toast({
        title: "Dama!",
        description: "Uma peça do computador virou dama!",
      });
    }else {
      newBoard[selectedMove.to.row][selectedMove.to.col] = piece;
    }

    setBoard(newBoard);
    setCurrentPlayer("red");
  };

  //verifica fim de jogo sempre que o tabuleiro ou o turno mudar
  React.useEffect(() => {
    let hasMove = false;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let j = 0; j < BOARD_SIZE; j++) {
        if(board[i][j] && board[i][j].includes(currentPlayer)) {
          const moves = findValidMoves(i, j);
          if(moves.length > 0) {
            hasMove = true;
            break;
          }
        }
      }
      if(hasMove) break;
    }

    if(!hasMove) {
      //verificar se também o oponente não possui movimentos.
      if(currentPlayer === "red") {
        toast({
          title: "Fim de Jogo",
          description: "Você perdeu!",
        });
      }else {
        toast({
          title: "Fim de Jogo",
          description: "Você venceu!",
        });
      }
      setTimeout(() => {
        onBackToMenu();
      }, 3000);
    }
  }, [board, currentPlayer, toast, onBackToMenu]);

  React.useEffect(() => {
    if(currentPlayer === "black") {
      setTimeout(computerMove, 1000);
    }
  }, [currentPlayer]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={onBackToMenu} className="text-white">
          Voltar ao Menu
        </Button>
        <div className="text-xl font-semibold">Dificuldade: {difficulty}</div>
      </div>

      <motion.div
        className="grid grid-cols-8 gap-1 bg-gray-700 p-4 rounded-lg"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isValidMove = validMoves.some(
              (move) => move.to.row === rowIndex && move.to.col === colIndex
            );

            return (
              <motion.div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  aspect-square rounded-lg cursor-pointer relative
                  ${(rowIndex + colIndex) % 2 === 0 ? "bg-gray-400" : "bg-gray-800"}
                  ${
                    selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex
                      ? "ring-2 ring-yellow-400"
                      : ""
                  }
                  ${isValidMove ? "ring-2 ring-green-400" : ""}
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePieceClick(rowIndex, colIndex)}
              >
                {cell && (
                  <motion.div
                    className={`
                      w-full h-full rounded-full flex items-center justify-center
                      ${cell.includes("red") ? "bg-red-500" : "bg-gray-900"}
                    `}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    {cell.includes("king") && (
                      <div className="w-1/2 h-1/2 rounded-full bg-yellow-400" />
                    )}
                  </motion.div>
                )}
              </motion.div>
            );
          })
        )}
      </motion.div>

      <div className="mt-4 text-center text-lg">
        Vez do jogador: {currentPlayer === "red" ? "Vermelho" : "Preto"}
      </div>
    </div>
  );
}

export default Game;
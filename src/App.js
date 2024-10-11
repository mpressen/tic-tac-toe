import { useState } from 'react';

function Square({ className, value, onSquareClick }) {
  return <button className={className + " square"} onClick={onSquareClick}>{value}</button>
}

function Board({ currentMove, xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || winner) {
      return
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares, i);
  }

  const [winner, winning_cases] = calculateWinner(squares)
  let status
  if (winning_cases) {
    status = "Winner: " + (xIsNext ? 'O' : 'X')
  } else if (currentMove == 9) {
    status = "It's a draw"
  } else {
    status = "Next player: " + (xIsNext ? 'X' : 'O')
  }

  return (
    <>
      <div className='status'>{status}</div>
      {[0, 1, 2].map((row) => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map((col) => {
            const index = row * 3 + col;
            return <Square className={winning_cases?.includes(index) ? 'red' : null} key={index} value={squares[index]} onSquareClick={() => handleClick(index)} />
          })}
        </div>
      ))}
    </>
  );

}

export default function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), index: -1 }]);
  const [currentMove, setCurrentMove] = useState(0)
  const [sortIsDesc, setSortIsDesc] = useState(true)
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove].squares;

  function handlePlay(nextSquares, i) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, index: i }];
    setHistory(nextHistory)
    setCurrentMove(currentMove + 1)
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove)
  }

  function sortMove() {
    setSortIsDesc(!sortIsDesc)
  }

  const moves = history.map((turnInfo, move) => {
    let description;
    if (move == currentMove) {
      description = "You are at move # " + move
    } else if (move > 0) {
      console.log(turnInfo)
      const row = Math.floor(turnInfo.index / 3);
      const col = turnInfo.index % 3;
      const symbol = move % 2 === 0 ? 'O' : 'X';
      description = 'Go to move #' + move + ' - ' + symbol + '(' + row + ', ' + col + ')';
    } else {
      description = "Go to game start"
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  }
  )

  return <div>
    <div className='game'>
      <div className='game-board'>
        <Board currentMove={currentMove} xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className='game-info'>
        <ol>{sortIsDesc ? moves : moves.reverse()}</ol>
        <button onClick={sortMove}>Toggle Sort Order</button>
      </div>
    </div>
  </div>
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] == squares[b] && squares[a] == squares[c] && squares[a] != null) {
      return [squares[a], [a, b, c]]
    }
  }
  return [null, null]
}

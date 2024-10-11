import { useState } from 'react'

function Square({ callback, square, index }) {
  return <button className="square" onClick={() => callback(index)}>{square[index]}</button>
}

export default function Board() {
  let [square, setSquare] = useState([
    null, null, null,
    null, null, null,
    null, null, null
  ])
  let [tag, setTag] = useState('X')
  let [status, setStatus] = useState('Next player')

  function handleClick(index) {
    // bug missed !, I can override a  case !
    // if (squares[index]) {
    //   return
    // }
    if (status == 'Winner') {
      return
    }

    let new_square = [...square]
    new_square[index] = tag
    setSquare(new_square)
    let win = check_if_win(index, new_square)
    if (!win) {
      tag == 'X' ? setTag('O') : setTag('X')
    } else {
      setStatus('Winner')
    }

  }

  function check_if_win(index, new_square) {
    // console.log(index)
    return checkColumn(index, new_square) || checkRow(index, new_square) || checkDiagonale(index, new_square)
  }

  function checkColumn(index, new_square) {
    const colIndex = index % 3

    let check = new_square[colIndex] == tag && new_square[colIndex + 3] == tag && new_square[colIndex + 6] == tag
    return check
  }

  function checkRow(index, new_square) {
    const rowIndex = Math.floor(index / 3)
    const rowStart = rowIndex * 3
    return new_square[rowStart] == tag && new_square[rowStart + 1] == tag && new_square[rowStart + 2] == tag

  }

  function checkDiagonale(index, new_square) {
    const first_diagonale = [0, 4, 8];
    const second_diagonale = [2, 4, 6];

    if (first_diagonale.includes(index)) {
      return new_square[0] == tag && new_square[4] == tag && new_square[8] == tag
    } else if (second_diagonale.includes(index)) {
      return new_square[2] == tag && new_square[4] == tag && new_square[6] == tag
    } else {
      return false
    }
  }

  return <div className=''>
    <div className="status">
      <h1 className='game-info'>
        {status} : {tag}
      </h1>
    </div>
    <div className="board-row">
      < Square callback={handleClick} square={square} index={0} />
      < Square callback={handleClick} square={square} index={1} />
      < Square callback={handleClick} square={square} index={2} />
    </div>
    <div className="board-row">
      < Square callback={handleClick} square={square} index={3} />
      < Square callback={handleClick} square={square} index={4} />
      < Square callback={handleClick} square={square} index={5} />
    </div>
    <div className="board-row">
      < Square callback={handleClick} square={square} index={6} />
      < Square callback={handleClick} square={square} index={7} />
      < Square callback={handleClick} square={square} index={8} />
    </div>
  </div>
}

import { useState } from 'react'
import '../css/App.css'

interface SquareProps {
    value: string | null;
    onSquareClick: () => void;
}

function Square( {value, onSquareClick} : SquareProps) {
    return <button className="square" onClick = {onSquareClick}>{value}</button>
}

interface BoardProps {
    xIsNext : boolean
    squares: (string | null)[]
    onPlay: (nextSquares: (string | null)[]) => void;
}

function Board( {xIsNext, squares, onPlay} : BoardProps) {
    const winner: string | null = calculateWinner(squares)
    let status: string;
    if (winner) {
        status = "Winner: " + winner;
    }
    else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }

    function handleClick(i: number) : void {
        if(squares[i] || calculateWinner(squares)) {
            return
        }
        const nextSquares: (string|null)[] = squares.slice()
        if(xIsNext) {
            nextSquares[i] = "X"
        }
        else {
            nextSquares[i] = "O"  
        }
        onPlay(nextSquares);
    }
    return (
    <>
        <div className="status">{status}</div>
        <div className="board-row">
            <Square value={squares[0]} onSquareClick={() => handleClick(0)}></Square>
            <Square value={squares[1]} onSquareClick={() => handleClick(1)}></Square>
            <Square value={squares[2]} onSquareClick={() => handleClick(2)}></Square>
        </div>
        <div className="board-row">
            <Square value={squares[3]} onSquareClick={() => handleClick(3)}></Square>
            <Square value={squares[4]} onSquareClick={() => handleClick(4)}></Square>
            <Square value={squares[5]} onSquareClick={() => handleClick(5)}></Square>
        </div>
        <div className="board-row">
            <Square value={squares[6]} onSquareClick={() => handleClick(6)}></Square>
            <Square value={squares[7]} onSquareClick={() => handleClick(7)}></Square>
            <Square value={squares[8]} onSquareClick={() => handleClick(8)}></Square>
        </div>
    </>
    );
}

function Game() {
    const [history, setHistory] = useState<(string | null)[][]>([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0)
    const xIsNext = currentMove % 2 === 0
    const currentSquares: (string | null)[] = history[currentMove]

    function handlePlay(nextSquares: (string | null)[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove)
    }

    const moves = history.map((squares, move) =>  {
        let description: string;
        if (move > 0) {
            description = 'Go to move #' + move
        }
        else {
            description = 'Go to game start'
        }
        return (
            <li key={move}>
                <button onClick={() => jumpTo(move)}>{description}</button>
            </li>
        )
    })

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares = {currentSquares} onPlay = {handlePlay}></Board>
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    )
}

function calculateWinner(squares: (string | null)[]) : null | string {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i:number = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

function App() {
    return <div>
        <Game></Game>
    </div>
}



export default App
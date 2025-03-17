import React from "react";
import { Box, Text, useInput } from "ink";
import { BoardState, getInitialBoardState } from "./BoardState.js";
import { Board } from "./Board.js";

export type ZeroOneTwo = 0 | 1 | 2

export function Game({ onGameOver }: { onGameOver:()=>void }) {

  const [boardState, setBoardState] = React.useState<BoardState>(getInitialBoardState())
  const [currentTurn, setCurrentTurn] = React.useState<'X' | 'O'>('X')
  const [highlightedCell, setHighlightedCell] = React.useState<{ row: ZeroOneTwo, col: ZeroOneTwo }>({ row: 0, col: 0 })
  const [gameResult, setGameResult] = React.useState<string>()

  useInput((input, key) => {

    if(gameResult) {
      onGameOver()
      return
    }

    if (key.leftArrow && highlightedCell.col > 0) {
      setHighlightedCell(c => ({ ...c, col: c.col - 1 as ZeroOneTwo }))
    }
    if (key.rightArrow && highlightedCell.col < 2) {
      setHighlightedCell(c => ({ ...c, col: c.col + 1 as ZeroOneTwo }))
    }
    if (key.upArrow && highlightedCell.row > 0) {
      setHighlightedCell(c => ({ ...c, row: c.row - 1 as ZeroOneTwo }))
    }
    if (key.downArrow && highlightedCell.row < 2) {
      setHighlightedCell(c => ({ ...c, row: c.row + 1 as ZeroOneTwo }))
    }

    if (key.return) {
      const { row, col } = highlightedCell
      if (boardState[row][col] === null) {
        const newBoard = cloneBoardState(boardState)
        newBoard[row][col] = currentTurn
        setBoardState(newBoard)

        const winner = checkWin(newBoard)
        if (winner) {
          setGameResult(`The winner is ${winner}! Press any key to continue.`)
        }
        if (checkDraw(newBoard)) {
          setGameResult('Draw. Press any key to continue.')
        }

        setCurrentTurn(c => c === 'X' ? 'O' : 'X')
      }
    }
  })

  return (
    <Box flexDirection="column" gap={1}>
      {gameResult
        ? <Text color='yellow'>{gameResult}</Text>
        : <Text color='white'>Current turn: <Text>{currentTurn}</Text></Text>
      }

      <Board boardState={boardState} highlightedCell={gameResult ? undefined : highlightedCell} previewValue={currentTurn} />
    </Box>
  )
}

function cloneBoardState(boardState: BoardState): BoardState {
  return boardState.map(row => [...row]) as BoardState
}

function checkWin(boardState: BoardState): 'X' | 'O' | null {
  // Check rows
  for (let i of [0, 1, 2] as const) {
    if (boardState[i][0] && boardState[i][0] === boardState[i][1] && boardState[i][1] === boardState[i][2]) {
      return boardState[i][0]
    }
  }

  // Check columns
  for (let i of [0, 1, 2] as const) {
    if (boardState[0][i] && boardState[0][i] === boardState[1][i] && boardState[1][i] === boardState[2][i]) {
      return boardState[0][i]
    }
  }

  // Check diagonals
  if (boardState[0][0] && boardState[0][0] === boardState[1][1] && boardState[1][1] === boardState[2][2]) {
    return boardState[0][0]
  }
  if (boardState[0][2] && boardState[0][2] === boardState[1][1] && boardState[1][1] === boardState[2][0]) {
    return boardState[0][2]
  }

  return null
}

function checkDraw(boardState: BoardState): boolean {
  return boardState.every(row => row.every(cell => cell !== null))
}
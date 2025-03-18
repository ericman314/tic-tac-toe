import React, { useReducer } from "react";
import { Box, Text, useInput } from "ink";
import { BoardState, getInitialBoardState } from "./BoardState.js";
import { Board } from "./Board.js";

export type ZeroOneTwo = 0 | 1 | 2

export function Game({ onGameOver }: { onGameOver:()=>void }) {

  const [highlightedCell, setHighlightedCell] = React.useState<{ row: ZeroOneTwo, col: ZeroOneTwo }>({ row: 0, col: 0 })

  const [state, dispatch] = useReducer(reducer, initialState)

  useInput((input, key) => {

    if (state.gameResult) {
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
      if (state.board[row][col] === null) {
        dispatch({ type: 'MAKE_PLAYER_MOVE', row, col })
      }
    }
  })

  return (
    <Box flexDirection="column" gap={1}>
      {state.gameResult
        ? <Text color='yellow'>{state.gameResult}</Text>
        : <Text color='white'>Current turn: <Text>{state.currentTurn}</Text></Text>
      }

      <Board boardState={state.board} highlightedCell={state.gameResult ? undefined : highlightedCell} previewValue={state.currentTurn} />
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

const initialState: GameState = {
  board: getInitialBoardState(),
  currentTurn: 'X',
  gameResult: null
}

type GameState = {
  board: BoardState,
  currentTurn: 'X' | 'O',
  gameResult: string | null
}

type Action = {
  type: 'MAKE_PLAYER_MOVE', row: ZeroOneTwo, col: ZeroOneTwo
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'MAKE_PLAYER_MOVE': {
      const newBoard = cloneBoardState(state.board)
      newBoard[action.row][action.col] = state.currentTurn

      let newGameResult = null
      if (checkWin(newBoard)) {
        newGameResult = `The winner is ${state.currentTurn}! Press any key to continue.`
      }
      else if (checkDraw(newBoard)) {
        newGameResult = 'Draw. Press any key to continue.'
      }

      return {
        ...state,
        board: newBoard,
        currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
        gameResult: newGameResult
      }
    }
    default:
      const _exhaustiveCheck: never = action.type
      throw new Error(`Unhandled action: ${action}`)
  }
}
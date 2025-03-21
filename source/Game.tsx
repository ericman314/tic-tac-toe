import React, { useEffect, useReducer } from "react";
import { Box, Text, useInput } from "ink";
import { BoardState, getInitialBoardState } from "./BoardState.js";
import { Board } from "./Board.js";

export type GameDifficulty = 'easy' | 'intermediate' | 'impossible'

export type ZeroOneTwo = 0 | 1 | 2

type GameProps = {
  cpuPlayer: 'X' | 'O' | null,
  numberOfPlayers: number,
  difficulty?: GameDifficulty,
  onGameOver: () => void
}

export function Game({ cpuPlayer, numberOfPlayers, difficulty = 'easy', onGameOver }: GameProps) {

  const [highlightedCell, setHighlightedCell] = React.useState<{ row: ZeroOneTwo, col: ZeroOneTwo }>({ row: 0, col: 0 })

  const [state, dispatch] = useReducer(reducer, initialState)

  // Make a first CPU move if the CPU is playing as X
  useEffect(() => {
    if (numberOfPlayers === 1 && cpuPlayer === 'X') {
      dispatch({ type: 'MAKE_CPU_MOVE', difficulty: 'easy' }) // Always make a random move to begin
    }
  }, [])

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

        // After the player goes, make the CPU move. If the game is already finished, this is a no-op.
        if (numberOfPlayers === 1) {
          dispatch({ type: 'MAKE_CPU_MOVE', difficulty })
        }
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

type Action =
  | { type: 'MAKE_PLAYER_MOVE', row: ZeroOneTwo, col: ZeroOneTwo }
  | { type: 'MAKE_CPU_MOVE', difficulty: GameDifficulty }

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {

    case 'MAKE_PLAYER_MOVE': {
      const newBoard = cloneBoardState(state.board)
      newBoard[action.row][action.col] = state.currentTurn

      return {
        ...state,
        board: newBoard,
        currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
        gameResult: getGameResult({ ...state, board: newBoard })
      }
    }

    case 'MAKE_CPU_MOVE': {

      // Check to make sure we are not already in a draw condition, which would result in an infinite loop
      if (checkWin(state.board) || checkDraw(state.board)) {
        return state // no-op
      }

      switch (action.difficulty) {
        case 'easy': {
          // Choose a random empty cell
          let cell = getRandomEmptyCell(state.board)
          if (!cell) return state
          const newBoard = cloneBoardState(state.board)
          newBoard[cell.row][cell.col] = state.currentTurn

          return {
            ...state,
            board: newBoard,
            currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
            gameResult: getGameResult({ ...state, board: newBoard })
          }
        }
        case 'intermediate': {
          let cell = getIntermediateCpuMove(state.board, state.currentTurn)
          const newBoard = cloneBoardState(state.board)
          newBoard[cell.row][cell.col] = state.currentTurn

          return {
            ...state,
            board: newBoard,
            currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
            gameResult: getGameResult({ ...state, board: newBoard })
          }
        }
        case 'impossible': {
          const newBoard = cloneBoardState(state.board)
          for (let r of [0, 1, 2] as const) {
            for (let c of [0, 1, 2] as const) {
              if (!newBoard[r][c]) {
                newBoard[r][c] = state.currentTurn
              }
            }
          }
          return {
            ...state,
            board: newBoard,
            currentTurn: state.currentTurn === 'X' ? 'O' : 'X',
            gameResult: getGameResult({ ...state, board: newBoard })
          }
        }
        default:
          const _exhaustiveCheck: never = action.difficulty
          throw new Error(`Unhandled action: ${action}`)
      }
    }

    default:
      const _exhaustiveCheck: never = action
      throw new Error(`Unhandled action: ${action}`)
  }
}

function getGameResult(state: GameState): string | null {
  if (checkWin(state.board)) {
    return `The winner is ${state.currentTurn}! Press any key to continue.`
  }
  else if (checkDraw(state.board)) {
    return 'Draw. Press any key to continue.'
  }
  return null
}

/**
 * Returns the row and column of a cell that the CPU should fill. The CPU will will if it can, otherwise it will block
 * the player from winning. If neither of those conditions are met, it will make a random move.
 * @param board The current board state
 * @param cpuPlayer The player that the CPU is playing as
 * @returns The row and column of the cell
 */
function getIntermediateCpuMove(board: BoardState, cpuPlayer: 'X' | 'O'): { row: ZeroOneTwo, col: ZeroOneTwo } {
  // Two rules: if the CPU can win, it should win. If the CPU can block the player from winning, it should do that.
  let winCell = findThirdCell(board, cpuPlayer)
  if (winCell) {
    return winCell
  }

  let blockCell = findThirdCell(board, cpuPlayer === 'X' ? 'O' : 'X')
  if (blockCell) {
    return blockCell
  }

  return getRandomEmptyCell(board)!
}

/**
 * Returns the row and column of a cell that, if filled by the player, would result in a win.
 * Returns null if no such cell exists.
 * @param board The current board state
 * @param player The player to check for
 * @returns The row and column of the cell, or null if no such cell exists
 */
function findThirdCell(board: BoardState, player: 'X' | 'O'): { row: ZeroOneTwo, col: ZeroOneTwo } | null {
  for (let r of [0, 1, 2] as const) {
    for (let c of [0, 1, 2] as const) {
      if (board[r][c]) {
        // If this cell is already occupied, skip it
        continue
      }
      let proposeBoard = cloneBoardState(board)
      proposeBoard[r][c] = player
      if (checkWin(proposeBoard)) {
        return { row: r, col: c }
      }
    }
  }

  return null
}

/**
 * Returns a random empty cell on the board. If the board is full, returns null.
 * @param board The current board state
 * @returns The row and column of the cell, or null if the board is full
 */
function getRandomEmptyCell(board: BoardState): { row: ZeroOneTwo, col: ZeroOneTwo } | null {
  if (checkDraw(board)) {
    return null
  }

  let r, c
  do {
    r = Math.floor(Math.random() * 3) as ZeroOneTwo
    c = Math.floor(Math.random() * 3) as ZeroOneTwo
  } while (board[r][c] !== null)
  return { row: r, col: c }
}
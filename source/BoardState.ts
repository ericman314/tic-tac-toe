
export type CellState = 'X' | 'O' | null

export type BoardState = [
  [CellState, CellState, CellState],
  [CellState, CellState, CellState],
  [CellState, CellState, CellState]
]

export function getInitialBoardState(): BoardState {
  return [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ]
}
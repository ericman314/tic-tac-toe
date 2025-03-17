import React from "react"
import { Box, Newline, Text } from "ink"
import { BoardState, CellState } from "./BoardState.js"
import { ZeroOneTwo } from "./Game.js"

type BoardProps = {
  boardState: BoardState
  highlightedCell?: { row: ZeroOneTwo, col: ZeroOneTwo }
  previewValue?: CellState
}

export function Board({ boardState, highlightedCell, previewValue }: BoardProps) {

  return <Box flexDirection="column" >
    <Box flexDirection="row">
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={0} col={0} />
      <ColumnSeparator />
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={0} col={1} />
      <ColumnSeparator />
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={0} col={2} />
    </Box>

    <RowSeparator />

    <Box flexDirection="row">
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={1} col={0} />
      <ColumnSeparator />
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={1} col={1} />
      <ColumnSeparator />
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={1} col={2} />
    </Box>

    <RowSeparator />

    <Box flexDirection="row">
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={2} col={0} />
      <ColumnSeparator />
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={2} col={1} />
      <ColumnSeparator />
      <CellWrapper boardState={boardState} highlightedCell={highlightedCell} previewValue={previewValue} row={2} col={2} />
    </Box>

  </Box>

}

function CellWrapper({ boardState, highlightedCell, previewValue, row, col }: {
  boardState: BoardState,
  highlightedCell?: { row: ZeroOneTwo, col: ZeroOneTwo },
  previewValue?: CellState,
  row: ZeroOneTwo,
  col: ZeroOneTwo
}) {

  let isHighlighted = highlightedCell?.row === row && highlightedCell?.col === col
  let value = boardState[row][col]
  let isPreview = false
  if (!value && isHighlighted && previewValue) {
    value = previewValue
    isPreview = true
  }

  return <Cell value={value} selected={isHighlighted} isPreview={isPreview} />

}

function Cell({ value, selected, isPreview }: { value: CellState, selected?: boolean, isPreview?: boolean }) {
  return <Box
    borderStyle={selected ? 'round' : undefined}
    borderColor='blue'
    width={5}
    height={3}
    justifyContent="center"
    alignItems="center"
    marginLeft={1}
    marginRight={1}
  >
    <Text color={isPreview ? 'blue' : 'white'}>{value}</Text>
  </Box>
}

function ColumnSeparator() {
  return (
    <Box>
      <Text>│<Newline />│<Newline />│</Text>
    </Box>
  )
}

function RowSeparator() {
  return (
    <Box>
      <Text>───────┼───────┼───────</Text>
    </Box>
  )
}
import React from 'react'
import { Box, Text, useInput } from "ink"

type UseMultiSelectDialogProps = {
  message: any
  options: string[]
  initialOption?: string
}

export function useMultiSelectDialog() {

  const [confirmContent, setConfirmContent] = React.useState<any>(null)

  function showConfirm({initialOption, options, message }: UseMultiSelectDialogProps) {
    return new Promise<string>((resolve) => {
      setConfirmContent(<MultiSelectDialog
        options={options}
        initialOption={initialOption}
        message={message}
        onSelect={option => {
          setConfirmContent(null)
          resolve(option)
        }}
      />)

    })
  }

  return [confirmContent, showConfirm] as const
}

type ConfirmDialogProps = {
  message: any
  options: string[]
  initialOption?: string
  onSelect: (option:string, optionIndex:number) => void
}

export function MultiSelectDialog({ options, initialOption, message, onSelect }: ConfirmDialogProps) {

  let initialIndex = initialOption ? options.indexOf(initialOption) : 0
  const [choice, setChoice] = React.useState<number>(initialIndex === -1 ? 0 : initialIndex)

  useInput((input, key) => {
    if (key.leftArrow) {
      let nextIndex = (choice - 1 + options.length) % options.length
      setChoice(nextIndex)
    }
    else if (key.rightArrow) {
      let nextIndex = (choice + 1) % options.length
      setChoice(nextIndex)
    }
    if (key.return) {
        onSelect(options[choice]||'', choice)
    }
  })

  return <Box flexDirection="column" borderStyle="single" padding={1} borderColor="blue">
    <Box>
      <Box flexDirection="column" justifyContent="center">
        <Box flexDirection="column" justifyContent="space-between" gap={1}>

          {/* The message */}
          <Box justifyContent="center">
            <Box borderColor="blue" >{message}</Box>
          </Box>

          <Box justifyContent="center" flexDirection='row' gap={2}>
            {options.map((option, index) => {
              return <Text key={index} underline={choice ===index}>{option}</Text>
            })}
          </Box>

        </Box>
      </Box>
    </Box>
  </Box>

}


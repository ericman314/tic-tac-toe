import React from 'react'
import { Box, Text, useInput } from "ink"

type UseConfirmDialogProps = {
  message: any
  okText?: string
  cancelText?: string
}

export function useConfirmDialog() {

  const [confirmContent, setConfirmContent] = React.useState<any>(null)

  function showConfirm({ okText = 'OK', cancelText = "Cancel", message }: UseConfirmDialogProps) {
    return new Promise<void>((resolve, reject) => {
      setConfirmContent(<ConfirmDialog
        okText={okText}
        cancelText={cancelText}
        message={message}
        onOk={()=>{
          setConfirmContent(null)
          resolve()
        }}
        onCancel={()=>{
          setConfirmContent(null)
          reject()
        }}
      />)

    })
  }

  return [confirmContent, showConfirm] as const
}

type ConfirmDialogProps = {
  message: any
  okText?: string
  cancelText?: string
  onOk?: () => void
  onCancel?: () => void
}

export function ConfirmDialog({ okText = 'OK', cancelText = "Cancel", message, onOk, onCancel }: ConfirmDialogProps) {

  const [choice, setChoice] = React.useState<boolean>(true)

  useInput((input, key) => {
    if (key.leftArrow || key.rightArrow) {
      setChoice(c => !c)
    }
    if (key.return) {
      if (choice) {
        onOk?.()
      } else {
        onCancel?.()
      }
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
            <Text color="blue" underline={choice}>{okText}</Text>
            <Text color="blue" underline={!choice}>{cancelText}</Text>
          </Box>

        </Box>
      </Box>
    </Box>
  </Box>

}


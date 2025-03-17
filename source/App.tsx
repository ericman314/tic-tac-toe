import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { useConfirmDialog } from './ConfirmDialog.js';
import { Game } from './Game.js';

export function App() {

	const [confirmContent, showConfirm] = useConfirmDialog()
	const [isGameBoardVisible, setIsGameBoardVisible] = React.useState(false)

	function beginGame() {
		setIsGameBoardVisible(true)
	}

	useEffect(() => {
		showConfirm({
			message: <Text color="blue">How about a nice game of <Text color="blue" underline>Tic Tac Toe</Text>?</Text>,
			okText: 'Yes!',
			cancelText: 'No, thank you'
		})
			.then(beginGame)
			.catch(() => { })
	}, [])

	function handleGameOver() {
		setIsGameBoardVisible(false)
		showConfirm({
			message: <Text color="blue">Do you want to play again?</Text>,
			okText: 'Yes',
			cancelText: 'No'
		})
			.then(beginGame)
			.catch(() => { })
	}

	return (
		<Box>
			{isGameBoardVisible && <Game onGameOver={handleGameOver} />}
			{confirmContent}
		</Box>
	);
}

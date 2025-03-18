import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { useConfirmDialog } from './ConfirmDialog.js';
import { Game } from './Game.js';

export function App() {

	const [confirmContent, showConfirm] = useConfirmDialog()
	const [isGameBoardVisible, setIsGameBoardVisible] = React.useState(false)
	const [numberOfPlayers, setNumberOfPlayers] = React.useState(1)
	const [cpuPlayer, setCpuPlayer] = React.useState<'X' | 'O'>('X')

	function beginGame() {
		setIsGameBoardVisible(true)
	}

	function setNumberOfPlayersAndBeginGame(numberOfPlayers: number) {
		setNumberOfPlayers(numberOfPlayers)
		if (numberOfPlayers === 1) {
			setCpuPlayer(Math.random() > 0.5 ? 'X' : 'O')
		}
		beginGame()
	}

	function promptForNumberOfPlayers() {
		showConfirm({
			message: <Text color="blue">How many players?</Text>,
			okText: '1',
			cancelText: '2'
		})
			.then(() => { setNumberOfPlayersAndBeginGame(1) })
			.catch(() => { setNumberOfPlayersAndBeginGame(2) })
	}

	useEffect(() => {
		showConfirm({
			message: <Text color="blue">How about a nice game of <Text color="blue" underline>Tic Tac Toe</Text>?</Text>,
			okText: 'Yes!',
			cancelText: 'No, thank you'
		})
			.then(promptForNumberOfPlayers)
			.catch(() => { })
	}, [])

	function handleGameOver() {
		setIsGameBoardVisible(false)
		showConfirm({
			message: <Text color="blue">Do you want to play again?</Text>,
			okText: 'Yes',
			cancelText: 'No'
		})
			.then(promptForNumberOfPlayers)
			.catch(() => { })
	}

	return (
		<Box>
			{isGameBoardVisible && <Game cpuPlayer={cpuPlayer} onGameOver={handleGameOver} numberOfPlayers={numberOfPlayers} />}
			{confirmContent}
		</Box>
	);
}

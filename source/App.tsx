import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import { Game, GameDifficulty } from './Game.js';
import { useMultiSelectDialog } from './useMultiSelectDialog.js';

export function App() {

	const [multiSelectContent, showMultiSelect] = useMultiSelectDialog()
	const [isGameBoardVisible, setIsGameBoardVisible] = React.useState(false)
	const [numberOfPlayers, setNumberOfPlayers] = React.useState(1)
	const [cpuPlayer, setCpuPlayer] = React.useState<'X' | 'O'>('X')
	const [difficulty, setDifficulty] = React.useState<GameDifficulty>('easy')

	function beginGame() {
		setIsGameBoardVisible(true)
	}

	function promptForDifficulty() {
		showMultiSelect({
			message: <Text color="blue">Choose difficulty:</Text>,
			options: ['Easy', 'Intermediate', 'Impossible'],
			initialOption: difficulty[0]?.toUpperCase() + difficulty.slice(1)
		})
			.then((option) => {
				let diff = option.toLowerCase() as GameDifficulty
				setDifficulty(diff as GameDifficulty)
				if (diff === 'impossible') {
					setCpuPlayer('O') // Let the human player go first
				} else {
					setCpuPlayer(Math.random() > 0.5 ? 'X' : 'O')
				}
				beginGame()
			})
	}

	function promptForNumberOfPlayers() {
		showMultiSelect({
			message: <Text color="blue">How many players?</Text>,
			options: ['One', 'Two'],
			initialOption: numberOfPlayers === 1 ? 'One' : 'Two'
		})
			.then((option) => {
				if (option === 'One') {
					setNumberOfPlayers(1)
					promptForDifficulty()
					return
				} else {
					setNumberOfPlayers(2)
					beginGame()
				}
			})
	}

	useEffect(() => {
		showMultiSelect({
			message: <Text color="blue">How about a nice game of <Text color="blue" underline>Tic Tac Toe</Text>?</Text>,
			options: ['Yes!', 'No, thank you'],
		})
			.then(option => {
				if (option.includes('Yes')) {
					promptForNumberOfPlayers()
				} else {
					return
				}
			})
	}, [])

	function handleGameOver() {
		setIsGameBoardVisible(false)
		showMultiSelect({
			message: <Text color="blue">Do you want to play again?</Text>,
			options: ['Yes', 'No']
		})
			.then(option => {
				if (option.includes('Yes')) {
					promptForNumberOfPlayers()
				} else {
					return
				}
			})
	}

	return (
		<Box>
			{isGameBoardVisible && <Game
				cpuPlayer={cpuPlayer}
				onGameOver={handleGameOver}
				numberOfPlayers={numberOfPlayers}
				difficulty={difficulty}
			/>}
			{multiSelectContent}
		</Box>
	);
}

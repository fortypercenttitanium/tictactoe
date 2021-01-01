// DOM grabbing module

const DOM = (() => {
	return {
		//Human or AI
		selection: document.querySelectorAll('.selection'),
		//Select Human/AI
		makeActive: function (e) {
			e.target.parentNode.querySelectorAll('.selection').forEach((child) => {
				child.classList.remove('active');
			});
			e.target.classList.add('active');
			if (e.target.classList.contains('human')) {
				if (e.target.classList.contains('one')) {
					Controller.player1.type = 'human';
				} else {
					Controller.player2.type = 'human';
				}
			} else if (e.target.classList.contains('one')) {
				Controller.player1.type = 'ai';
			} else {
				Controller.player2.type = 'ai';
			}
		},

		boardContainer: document.querySelector('.gameboard'),
		//fetch current squares
		getSquares: function () {
			return this.boardContainer.querySelectorAll('.square');
		},

		newSquare: function (html) {
			const square = document.createElement('div');
			square.className = 'square';
			square.innerHTML = html;
			return square;
		},

		newSquareInner: function (mark) {
			return `<span>${mark}</span>`;
		},

		clearBoard: function () {
			DOM.getSquares().forEach((square) => {
				this.boardContainer.removeChild(square);
			});
		},

		render: function (board) {
			this.clearBoard();
			board.forEach((square) => {
				this.boardContainer.appendChild(
					DOM.newSquare(DOM.newSquareInner(square.mark))
				);
			});
		},

		setupWindow: document.querySelector('.setup'),
		startButton: document.querySelector('.startgame'),
		turnIndicator: document.querySelector('.turn'),
		winnerBanner: document.querySelector('.winner'),

		winDisplay: function (winner) {
			if (winner) {
				this.winnerBanner.textContent = `${winner} wins!`;
			} else {
				this.winnerBanner.textContent = "It's a tie!";
			}
			const playAgainContainer = document.createElement('div');
			playAgainContainer.className = 'playagaincontainer';
			const playAgain = document.createElement('button');
			playAgain.textContent = 'Play Again';
			playAgain.className = 'playagain';
			playAgainContainer.appendChild(playAgain);
			this.winnerBanner.appendChild(playAgainContainer);
			playAgain.addEventListener('click', () => {
				location.reload();
				return false;
			});
		},
	};
})();

const Gameboard = (() => {
	//each square saved as an object with a mark property, which can either be an empty string, 'X', or 'O'
	const square = {
		mark: '',
	};
	//board saved as array
	const board = [];
	//board is inaccessible to other modules, but they can fetch it
	const getBoard = () => {
		return board;
	};
	//controlled board manipulation sent to the game controller
	const newMarker = (mark, index) => {
		board[index] = { mark };
		DOM.render(board);
	};

	// game board load
	const init = () => {
		for (let count = 1; count <= 9; count++) {
			board.push(square);
		}
		DOM.render(getBoard());
	};

	// make these available to other modules
	return {
		getBoard,
		init,
		newMarker,
	};
})();

const Controller = (() => {
	//type is decided in start screen
	const player1 = {
		name: 'Player 1',
		marker: 'X',
		type: '',
	};

	const player2 = {
		name: 'Player 2',
		marker: 'O',
		type: '',
	};
	//turn counter
	let player1turn = true;
	//page load selection screen
	const init = () => {
		DOM.selection.forEach((element) => {
			element.addEventListener('click', DOM.makeActive);
		}),
			DOM.startButton.addEventListener('click', () => {
				if (selectionCheck()) {
					startGame();
				} else {
					alert('Please select a player type for each player');
				}
			});
	};
	//toggle turn
	playerToggle = () => {
		player1turn = !player1turn;
	};
	//before starting, make sure the type of player is selected for each
	const selectionCheck = () => {
		return Boolean(player1.type && player2.type);
	};

	const startGame = () => {
		DOM.setupWindow.style.display = 'none';
		Gameboard.init();
		takeTurn();
	};

	//check the board for every win condition
	const checkWinner = () => {
		const board = Gameboard.getBoard();
		const winConditions = [
			[0, 1, 2],
			[3, 4, 5],
			[6, 7, 8],
			[0, 3, 6],
			[1, 4, 7],
			[2, 5, 8],
			[0, 4, 8],
			[2, 4, 6],
		];
		//if any of the conditions are true, stop the game and announce the winner in the console
		if (
			winConditions.some((array) => {
				let winCheck = [];
				array.forEach((box) => {
					if (board[box].mark !== '') {
						winCheck.push(board[box]);
					}
				});
				if (winCheck.length == 3) {
					if (
						winCheck.every((square) => {
							return square.mark == 'X';
						})
					) {
						DOM.winDisplay(player1.name);
						return true;
					} else if (
						winCheck.every((square) => {
							return square.mark == 'O';
						})
					) {
						DOM.winDisplay(player2.name);
						return true;
					} else {
						return false;
					}
				}
			})
		) {
			return true;
			//if the board has 9 marks without a winner, it's a tie
		} else if (
			board.filter((square) => {
				return square.mark !== '';
			}).length == 9
		) {
			DOM.winDisplay();
			return true;
		} else return false;
	};
	// AI...sort of...
	const computerPlay = (marker) => {
		let choices = Gameboard.getBoard().map((square, index) => {
			if (square.mark !== '') {
				return false;
			} else {
				return index;
			}
		});
		choices = choices.filter((item) => {
			return item !== false;
		});
		const selection = Math.floor(Math.random() * choices.length);
		Gameboard.newMarker(marker, choices[selection]);
		playerToggle();
		takeTurn();
	};

	const humanPlay = (marker) => {
		DOM.getSquares().forEach((square) => {
			square.addEventListener('click', (e) => {
				if (e.currentTarget.textContent == '') {
					const index = Array.from(e.currentTarget.parentNode.children).indexOf(
						e.currentTarget
					);
					Gameboard.newMarker(marker, index);
					playerToggle();
					takeTurn();
					return;
				}
			});
		});
	};
	//flow controller, checks winner, swaps the player turn indicator
	const takeTurn = () => {
		if (!checkWinner()) {
			let player;
			if (player1turn) {
				player = player1;
			} else {
				player = player2;
			}
			DOM.turnIndicator.textContent = `${player.name}'s turn:`;
			if (player.type == 'ai') {
				computerPlay(player.marker);
			} else {
				humanPlay(player.marker);
			}
		} else console.log('Winner found, stopping game');
	};
	//load the game
	init();
	//export so the DOM can set their types
	return {
		player1,
		player2,
	};
})();

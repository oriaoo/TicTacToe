const Gameboard = (() => {
    const cellElements = document.querySelectorAll('.cell');
    const cells = [];
  
    cellElements.forEach(cell => cells.push(cell));
  
    return { cells };
  })();
  
  const DisplayController = (() => {
    const messageModal = document.getElementById('message-modal');
    const message = document.getElementById('message');
    const playerOneName = document.getElementById('player-one-name');
    const playerTwoName = document.getElementById('player-two-name');
  
    function displayOutcome(toShow, playerWon = '') {
      if (toShow) {
        messageModal.style.display = 'flex';
  
        if (playerWon === 'Draw') {
          message.innerText = `It's a draw!`;
        }
  
        else {
          message.innerText = `${playerWon} wins!`;
          updateScore(playerWon);
        }
      }
  
      else {
        messageModal.style.display = 'none';
      }
    }
  
    function updateScore(playerWon) {
      const playerWonScore = playerWon === playerOneName.innerText ?
        document.getElementById('player-one-score') :
        document.getElementById('player-two-score');
  
      playerWonScore.innerText = playerWonScore.innerText === '–' ? 1 : parseInt(playerWonScore.innerText) + 1;
    }
  
    function updatePlayerNames(playerOne, playerTwo) {
      playerOneName.innerText = playerOne;
      playerTwoName.innerText = playerTwo;
    }
  
    return { displayOutcome, updatePlayerNames };
  })();
  
  const Game = (() => {
    const PLAYER_ONE_MARK = 'X';
    const PLAYER_TWO_MARK = 'O';
    const WINNING_COMBINATIONS = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    const continueBtn = document.getElementById('continue-btn');
    const scoreboard = document.querySelectorAll('.player-info');
    const cells = Gameboard.cells;
    const retryBtn = document.getElementById('retry-button');
    let playerOneName;
    let playerTwoName;
    let playerOneTurn;
  
    function resetBoard() {
      playerOneTurn = true;
  
      cells.forEach(cell => {
        cell.innerText = '';
        cell.classList.remove('filled');
      })
  
      scoreboard[0].classList.add('active-player');
      scoreboard[1].classList.remove('active-player');
  
      DisplayController.displayOutcome(false);
    }
  
    function startGame() {
      resetBoard();
  
      cells.forEach(cell => {
        cell.removeEventListener('click', handleClick);
        cell.addEventListener('click', handleClick);
      });
    }
  
    function handleClick(e) {
      const cell = e.target;
      const currentMark = playerOneTurn ? PLAYER_ONE_MARK : PLAYER_TWO_MARK;
  
      cell.innerText = currentMark;
      cell.classList.add('filled');
  
      if (checkWin(currentMark)) endGame(true);
      else if (isDraw()) endGame(false);
      else swapPlayerTurns();
    }
  
    function checkWin(currentMark) {
      return WINNING_COMBINATIONS.some((combination) => {
        return combination.every((index) => {
          return cells[index].innerText === currentMark;
        });
      });
    }
  
    function isDraw() {
      return [...cells].every((cell) => {
        return cell.innerText !== '';
      });
    }
  
    function swapPlayerTurns() {
      playerOneTurn = !playerOneTurn;
      scoreboard.forEach((playerInfo) =>
        playerInfo.classList.toggle('active-player'),
      );
    }
  
    function endGame(hasWon) {
      if (hasWon) {
        const winner = playerOneTurn ? playerOneName : playerTwoName;
  
        cells.forEach((cell) => cell.classList.add('filled'));
        DisplayController.displayOutcome(true, winner);
      }
  
      else {
        DisplayController.displayOutcome(true, 'Draw');
      }
  
      retryBtn.addEventListener('click', startGame);
    }
  
    function registerPlayers() {
      continueBtn.addEventListener('click', handlePlayers);
    }
  
    function handlePlayers() {
      const playersModal = document.getElementById('players-modal');
      const playerOneInput = document.getElementById('one-name');
      const playerTwoInput = document.getElementById('two-name');
  
      playerOneName = playerOneInput.value !== '' ? playerOneInput.value : 'Player 1';
      playerTwoName = playerTwoInput.value !== '' ? playerTwoInput.value : 'Player 2';
  
      playersModal.style.display = 'none';
  
      DisplayController.updatePlayerNames(playerOneName, playerTwoName);
    }
  
    return { startGame, registerPlayers };
  })();
  
  Game.registerPlayers();
  Game.startGame();
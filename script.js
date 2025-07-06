class FruitBoxGame {
    constructor() {
        this.board = [];
        this.boardSize = 8;
        this.fruits = ['🍎', '🍊', '🍌', '🍇', '🍓', '🥝', '🍑', '🥭'];
        this.score = 0;
        this.moves = 30;
        this.level = 1;
        this.selectedBox = null;
        this.isAnimating = false;
        this.targets = { '🍎': 15, '🍊': 12, '🍌': 10 };
        this.powerUps = { bomb: 3, rainbow: 2, lightning: 2 };
        this.activePowerUp = null;
        
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.createBoard();
        this.renderBoard();
        this.updateUI();
        this.removeInitialMatches();
    }

    createBoard() {
        this.board = [];
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                this.board[row][col] = this.getRandomFruit();
            }
        }
    }

    getRandomFruit() {
        const availableFruits = this.level <= 3 ? this.fruits.slice(0, 5) : this.fruits;
        return availableFruits[Math.floor(Math.random() * availableFruits.length)];
    }

    renderBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        gameBoard.style.gridTemplateRows = `repeat(${this.boardSize}, 1fr)`;

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const fruitBox = document.createElement('div');
                fruitBox.className = 'fruit-box';
                fruitBox.textContent = this.board[row][col];
                fruitBox.dataset.row = row;
                fruitBox.dataset.col = col;
                fruitBox.addEventListener('click', () => this.handleBoxClick(row, col));
                gameBoard.appendChild(fruitBox);
            }
        }
    }

    handleBoxClick(row, col) {
        if (this.isAnimating || this.moves <= 0) return;

        const clickedBox = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);

        if (this.activePowerUp) {
            this.usePowerUp(row, col);
            return;
        }

        if (this.selectedBox) {
            const [selectedRow, selectedCol] = this.selectedBox;
            
            if (selectedRow === row && selectedCol === col) {
                // Deselect the same box
                this.clearSelection();
                return;
            }

            if (this.areAdjacent(selectedRow, selectedCol, row, col)) {
                this.swapBoxes(selectedRow, selectedCol, row, col);
            } else {
                this.clearSelection();
                this.selectBox(row, col);
            }
        } else {
            this.selectBox(row, col);
        }
    }

    selectBox(row, col) {
        this.selectedBox = [row, col];
        const box = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        box.classList.add('selected');
    }

    clearSelection() {
        document.querySelectorAll('.fruit-box').forEach(box => {
            box.classList.remove('selected');
        });
        this.selectedBox = null;
    }

    areAdjacent(row1, col1, row2, col2) {
        const rowDiff = Math.abs(row1 - row2);
        const colDiff = Math.abs(col1 - col2);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    async swapBoxes(row1, col1, row2, col2) {
        this.isAnimating = true;
        
        // Swap in board array
        const temp = this.board[row1][col1];
        this.board[row1][col1] = this.board[row2][col2];
        this.board[row2][col2] = temp;

        // Update visual representation
        const box1 = document.querySelector(`[data-row="${row1}"][data-col="${col1}"]`);
        const box2 = document.querySelector(`[data-row="${row2}"][data-col="${col2}"]`);
        
        box1.textContent = this.board[row1][col1];
        box2.textContent = this.board[row2][col2];

        this.clearSelection();

        // Check for matches
        const matches = this.findMatches();
        
        if (matches.length === 0) {
            // No matches found, swap back
            setTimeout(() => {
                const temp = this.board[row1][col1];
                this.board[row1][col1] = this.board[row2][col2];
                this.board[row2][col2] = temp;
                
                box1.textContent = this.board[row1][col1];
                box2.textContent = this.board[row2][col2];
                
                this.isAnimating = false;
            }, 300);
        } else {
            this.moves--;
            this.updateUI();
            await this.processMatches();
            this.isAnimating = false;
            this.checkGameOver();
        }
    }

    findMatches() {
        const matches = [];
        const visited = new Set();

        // Check horizontal matches
        for (let row = 0; row < this.boardSize; row++) {
            let count = 1;
            let currentFruit = this.board[row][0];
            
            for (let col = 1; col < this.boardSize; col++) {
                if (this.board[row][col] === currentFruit && currentFruit !== null) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let i = col - count; i < col; i++) {
                            const key = `${row},${i}`;
                            if (!visited.has(key)) {
                                matches.push({ row, col: i, fruit: currentFruit });
                                visited.add(key);
                            }
                        }
                    }
                    count = 1;
                    currentFruit = this.board[row][col];
                }
            }
            
            if (count >= 3) {
                for (let i = this.boardSize - count; i < this.boardSize; i++) {
                    const key = `${row},${i}`;
                    if (!visited.has(key)) {
                        matches.push({ row, col: i, fruit: currentFruit });
                        visited.add(key);
                    }
                }
            }
        }

        // Check vertical matches
        for (let col = 0; col < this.boardSize; col++) {
            let count = 1;
            let currentFruit = this.board[0][col];
            
            for (let row = 1; row < this.boardSize; row++) {
                if (this.board[row][col] === currentFruit && currentFruit !== null) {
                    count++;
                } else {
                    if (count >= 3) {
                        for (let i = row - count; i < row; i++) {
                            const key = `${i},${col}`;
                            if (!visited.has(key)) {
                                matches.push({ row: i, col, fruit: currentFruit });
                                visited.add(key);
                            }
                        }
                    }
                    count = 1;
                    currentFruit = this.board[row][col];
                }
            }
            
            if (count >= 3) {
                for (let i = this.boardSize - count; i < this.boardSize; i++) {
                    const key = `${i},${col}`;
                    if (!visited.has(key)) {
                        matches.push({ row: i, col, fruit: currentFruit });
                        visited.add(key);
                    }
                }
            }
        }

        return matches;
    }

    async processMatches() {
        let matches = this.findMatches();
        
        while (matches.length > 0) {
            await this.removeMatches(matches);
            await this.dropBoxes();
            await this.fillEmptySpaces();
            matches = this.findMatches();
        }
    }

    async removeMatches(matches) {
        if (matches.length >= 3) {
            this.showMatchAnimation(matches.length);
        }

        const matchScore = matches.length * 10 * this.level;
        this.score += matchScore;

        // Update targets
        matches.forEach(match => {
            if (this.targets[match.fruit] !== undefined) {
                this.targets[match.fruit] = Math.max(0, this.targets[match.fruit] - 1);
            }
        });

        // Animate removal
        matches.forEach(match => {
            const box = document.querySelector(`[data-row="${match.row}"][data-col="${match.col}"]`);
            if (box) {
                box.classList.add('matched');
            }
            this.board[match.row][match.col] = null;
        });

        this.updateUI();

        return new Promise(resolve => {
            setTimeout(() => {
                matches.forEach(match => {
                    const box = document.querySelector(`[data-row="${match.row}"][data-col="${match.col}"]`);
                    if (box) {
                        box.style.opacity = '0';
                    }
                });
                resolve();
            }, 600);
        });
    }

    async dropBoxes() {
        let moved = false;
        
        for (let col = 0; col < this.boardSize; col++) {
            let writeIndex = this.boardSize - 1;
            
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (this.board[row][col] !== null) {
                    if (writeIndex !== row) {
                        this.board[writeIndex][col] = this.board[row][col];
                        this.board[row][col] = null;
                        moved = true;
                    }
                    writeIndex--;
                }
            }
        }

        if (moved) {
            this.renderBoard();
            return new Promise(resolve => setTimeout(resolve, 300));
        }
    }

    async fillEmptySpaces() {
        let filled = false;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.board[row][col] === null) {
                    this.board[row][col] = this.getRandomFruit();
                    filled = true;
                }
            }
        }

        if (filled) {
            this.renderBoard();
            
            // Add falling animation to new boxes
            document.querySelectorAll('.fruit-box').forEach(box => {
                const row = parseInt(box.dataset.row);
                if (this.board[row][parseInt(box.dataset.col)] !== null) {
                    box.classList.add('falling');
                }
            });

            return new Promise(resolve => {
                setTimeout(() => {
                    document.querySelectorAll('.fruit-box').forEach(box => {
                        box.classList.remove('falling');
                    });
                    resolve();
                }, 500);
            });
        }
    }

    removeInitialMatches() {
        let hasMatches = true;
        let attempts = 0;
        
        while (hasMatches && attempts < 100) {
            const matches = this.findMatches();
            if (matches.length === 0) {
                hasMatches = false;
            } else {
                matches.forEach(match => {
                    this.board[match.row][match.col] = this.getRandomFruit();
                });
            }
            attempts++;
        }
        
        this.renderBoard();
    }

    showMatchAnimation(matchCount) {
        const animation = document.getElementById('match-animation');
        const matchText = animation.querySelector('.match-text');
        const matchScore = animation.querySelector('.match-score');
        
        if (matchCount >= 5) {
            matchText.textContent = 'AMAZING!';
        } else if (matchCount >= 4) {
            matchText.textContent = 'GREAT!';
        } else {
            matchText.textContent = 'NICE!';
        }
        
        matchScore.textContent = `+${matchCount * 10 * this.level}`;
        
        animation.classList.remove('hidden');
        
        setTimeout(() => {
            animation.classList.add('hidden');
        }, 1500);
    }

    usePowerUp(row, col) {
        const powerUpType = this.activePowerUp;
        
        if (this.powerUps[powerUpType] <= 0) {
            this.activePowerUp = null;
            return;
        }

        this.powerUps[powerUpType]--;
        
        switch (powerUpType) {
            case 'bomb':
                this.useBomb(row, col);
                break;
            case 'rainbow':
                this.useRainbow(row, col);
                break;
            case 'lightning':
                this.useLightning(row, col);
                break;
        }
        
        this.activePowerUp = null;
        this.updateUI();
        this.processMatches();
    }

    useBomb(row, col) {
        const targets = [];
        for (let r = Math.max(0, row - 1); r <= Math.min(this.boardSize - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(this.boardSize - 1, col + 1); c++) {
                targets.push({ row: r, col: c, fruit: this.board[r][c] });
                this.board[r][c] = null;
            }
        }
        this.removeMatches(targets);
    }

    useRainbow(row, col) {
        const targetFruit = this.board[row][col];
        const targets = [];
        
        for (let r = 0; r < this.boardSize; r++) {
            for (let c = 0; c < this.boardSize; c++) {
                if (this.board[r][c] === targetFruit) {
                    targets.push({ row: r, col: c, fruit: targetFruit });
                    this.board[r][c] = null;
                }
            }
        }
        this.removeMatches(targets);
    }

    useLightning(row, col) {
        const targets = [];
        
        // Clear entire row
        for (let c = 0; c < this.boardSize; c++) {
            targets.push({ row, col: c, fruit: this.board[row][c] });
            this.board[row][c] = null;
        }
        
        // Clear entire column
        for (let r = 0; r < this.boardSize; r++) {
            if (r !== row) { // Don't double-clear the intersection
                targets.push({ row: r, col, fruit: this.board[r][col] });
                this.board[r][col] = null;
            }
        }
        
        this.removeMatches(targets);
    }

    showHint() {
        const possibleMoves = this.findPossibleMoves();
        
        if (possibleMoves.length > 0) {
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            const box1 = document.querySelector(`[data-row="${randomMove.row1}"][data-col="${randomMove.col1}"]`);
            const box2 = document.querySelector(`[data-row="${randomMove.row2}"][data-col="${randomMove.col2}"]`);
            
            box1.classList.add('hint');
            box2.classList.add('hint');
            
            setTimeout(() => {
                box1.classList.remove('hint');
                box2.classList.remove('hint');
            }, 2000);
        }
    }

    findPossibleMoves() {
        const moves = [];
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                // Check right neighbor
                if (col < this.boardSize - 1) {
                    this.simulateSwap(row, col, row, col + 1, moves);
                }
                // Check bottom neighbor
                if (row < this.boardSize - 1) {
                    this.simulateSwap(row, col, row + 1, col, moves);
                }
            }
        }
        
        return moves;
    }

    simulateSwap(row1, col1, row2, col2, moves) {
        // Temporarily swap
        const temp = this.board[row1][col1];
        this.board[row1][col1] = this.board[row2][col2];
        this.board[row2][col2] = temp;
        
        // Check for matches
        const matches = this.findMatches();
        
        if (matches.length > 0) {
            moves.push({ row1, col1, row2, col2 });
        }
        
        // Swap back
        this.board[row2][col2] = this.board[row1][col1];
        this.board[row1][col1] = temp;
    }

    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('moves').textContent = this.moves;
        document.getElementById('level').textContent = this.level;
        
        // Update targets
        const targetElements = document.querySelectorAll('.target-count');
        const targetFruits = Object.keys(this.targets);
        targetElements.forEach((element, index) => {
            if (targetFruits[index]) {
                element.textContent = this.targets[targetFruits[index]];
            }
        });
        
        // Update power-ups
        document.querySelector('#bomb-power span').textContent = this.powerUps.bomb;
        document.querySelector('#rainbow-power span').textContent = this.powerUps.rainbow;
        document.querySelector('#lightning-power span').textContent = this.powerUps.lightning;
        
        // Disable power-ups if count is 0
        document.getElementById('bomb-power').disabled = this.powerUps.bomb <= 0;
        document.getElementById('rainbow-power').disabled = this.powerUps.rainbow <= 0;
        document.getElementById('lightning-power').disabled = this.powerUps.lightning <= 0;
    }

    checkGameOver() {
        const targetsMet = Object.values(this.targets).every(count => count <= 0);
        
        if (targetsMet) {
            this.levelUp();
        } else if (this.moves <= 0) {
            this.gameOver(false);
        }
    }

    levelUp() {
        this.level++;
        this.moves = 30;
        this.score += 500; // Bonus for completing level
        
        // Reset targets with higher counts
        this.targets = {
            '🍎': 15 + (this.level * 2),
            '🍊': 12 + (this.level * 2),
            '🍌': 10 + (this.level * 2)
        };
        
        // Add more power-ups
        this.powerUps.bomb += 1;
        this.powerUps.rainbow += 1;
        this.powerUps.lightning += 1;
        
        // Make board larger for higher levels
        if (this.level % 3 === 0 && this.boardSize < 10) {
            this.boardSize++;
        }
        
        this.createBoard();
        this.removeInitialMatches();
        this.updateUI();
        
        this.showLevelUpMessage();
    }

    showLevelUpMessage() {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        
        title.textContent = 'Level Complete!';
        message.textContent = `Congratulations! You've reached level ${this.level}!`;
        
        modal.classList.remove('hidden');
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 2000);
    }

    gameOver(won) {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('game-over-title');
        const message = document.getElementById('game-over-message');
        
        if (won) {
            title.textContent = 'Congratulations!';
            message.textContent = `You won with a score of ${this.score}!`;
        } else {
            title.textContent = 'Game Over';
            message.textContent = `Your final score: ${this.score}. Try again!`;
        }
        
        modal.classList.remove('hidden');
    }

    resetGame() {
        this.score = 0;
        this.moves = 30;
        this.level = 1;
        this.boardSize = 8;
        this.selectedBox = null;
        this.isAnimating = false;
        this.targets = { '🍎': 15, '🍊': 12, '🍌': 10 };
        this.powerUps = { bomb: 3, rainbow: 2, lightning: 2 };
        this.activePowerUp = null;
        
        this.initializeGame();
        
        const modal = document.getElementById('game-over-modal');
        modal.classList.add('hidden');
    }

    setupEventListeners() {
        document.getElementById('new-game-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.resetGame());
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            document.getElementById('game-over-modal').classList.add('hidden');
        });
        document.getElementById('hint-btn').addEventListener('click', () => this.showHint());
        
        // Power-up buttons
        document.getElementById('bomb-power').addEventListener('click', () => {
            this.activePowerUp = this.activePowerUp === 'bomb' ? null : 'bomb';
        });
        document.getElementById('rainbow-power').addEventListener('click', () => {
            this.activePowerUp = this.activePowerUp === 'rainbow' ? null : 'rainbow';
        });
        document.getElementById('lightning-power').addEventListener('click', () => {
            this.activePowerUp = this.activePowerUp === 'lightning' ? null : 'lightning';
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FruitBoxGame();
});
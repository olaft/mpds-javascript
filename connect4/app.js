const { Console } = require(`../console-mpds`);
const console = new Console();

initConnect4().play();

function initConnect4() {
    let board;
    const boardView = initBoardView();
    const MAX_PLAYERS = 2;
    const MAX_TURNS = 42;
    let winnerCells;
    let turn;
    return {
        play: function () {
            do {
                board = initBoard();
                turn = 0;
                const players = [];
                players.push(initPlayer('R'));
                players.push(initPlayer('Y'));
                players[1].setBot(true);
                let currentPlayer;
                do {
                    currentPlayer = players[this.nextTurn()];
                    let col;
                    if (currentPlayer.isBot()) {
                        col = this.getAutoSelectedColumn();
                    } else {
                        col = boardView.getSelectedColumn(currentPlayer.getColor());
                    }
                    board.putToken(col, currentPlayer.getToken());
                    boardView.showBoard(board.getGrid());
                } while (!this.isWinner(currentPlayer.getColor()) && turn < MAX_TURNS);

                if (turn < MAX_TURNS) {
                    boardView.showWinner(currentPlayer.getColor(), winnerCells);
                } else {
                    boardView.showTie();
                }
            } while (this.isResumed());
        },
        getAutoSelectedColumn: function () {
            return Math.floor(Math.random() * board.getColums());
        },
        isWinner: function (color) {
            const TOKENS_TO_WIN = 4;
            function getRowConnet4() {
                let alignedTokens;
                let isConnet4 = false;
                for (let row = 0; !isConnet4 && row < board.getRows(); row++) {
                    for (let cursor = 0; cursor < board.getColums() - TOKENS_TO_WIN + 1; cursor++) {
                        alignedTokens = 0;
                        winnerCells = [];
                        for (let col = cursor; !isConnet4 && col < cursor + TOKENS_TO_WIN; col++) {
                            let token = board.getCell(row, col).getToken();
                            if (token !== undefined) {
                                if (token.getColor() === color) {
                                    alignedTokens++;
                                    winnerCells.push(board.getCell(row, col));
                                    isConnet4 = alignedTokens === TOKENS_TO_WIN
                                }
                            }
                        }
                    }
                }
                return isConnet4;
            }
            function getColumnConnet4() {
                let alignedTokens;
                let isConnet4 = false;
                for (let col = 0; !isConnet4 && col < board.getColums(); col++) {
                    for (let cursor = 0; !isConnet4 && cursor < board.getRows() - TOKENS_TO_WIN + 1; cursor++) {
                        alignedTokens = 0;
                        winnerCells = [];
                        for (let row = cursor; !isConnet4 && row < cursor + TOKENS_TO_WIN; row++) {
                            let token = board.getCell(row, col).getToken();
                            if (token !== undefined) {
                                if (token.getColor() === color) {
                                    alignedTokens++;
                                    winnerCells.push(board.getCell(row, col));
                                    isConnet4 = alignedTokens === TOKENS_TO_WIN
                                }
                            }
                        }
                    }
                }
                return isConnet4;
            }
            function getDiagonalConnect4() {
                let alignedLeftToRight;
                let alignedRightToLeft;
                let isLeftConnet4 = false;
                let isRightConnet4 = false;
                for (let row = 0; !isLeftConnet4 && row < board.getRows() - TOKENS_TO_WIN + 1; row++) {
                    for (let col = 0; !isLeftConnet4 && col < board.getColums() - TOKENS_TO_WIN + 1; col++) {
                        alignedLeftToRight = 0;
                        alignedRightToLeft = 0;
                        winnerCells = [];
                        for (let cursor = 0; (!isLeftConnet4 & !isRightConnet4) && cursor < TOKENS_TO_WIN; cursor++) {
                            let token = board.getCell(row + cursor, col + cursor).getToken();
                            if (token !== undefined) {
                                if (token.getColor() === color) {
                                    alignedLeftToRight++;
                                    winnerCells.push(board.getCell(row, col));
                                    isLeftConnet4 = alignedLeftToRight === TOKENS_TO_WIN;
                                }
                            }
                            token = board.getCell(row + cursor, col + TOKENS_TO_WIN - cursor - 1).getToken();
                            if (token !== undefined) {
                                if (token.getColor() === color) {
                                    alignedRightToLeft++;
                                    winnerCells.push(board.getCell(row, col));
                                    isRightConnet4 = alignedRightToLeft === TOKENS_TO_WIN;
                                }
                            }
                        }

                    }
                }
                return isLeftConnet4 || isRightConnet4;
            }
            return getRowConnet4() || getColumnConnet4() || getDiagonalConnect4();
        },
        nextTurn: function () {
            return (turn++) % MAX_PLAYERS;
        },
        isResumed: function () {
            return boardView.askResume() === 's';
        }
    }
}

function initBoard() {
    const COLUMNS = 7;
    const ROWS = 6;
    const GRID = [];
    for (let row = 0; row < ROWS; row++) {
        GRID[row] = [];
        for (let col = 0; col < COLUMNS; col++) {
            let cell = initCell();
            cell.setRow(row+1);
            cell.setColumn(col+1);
            GRID[row][col] = cell;
        }
    }
    return {
        putToken: function (col, token) {
            let isEmpty = false;
            for (let row = 0; !isEmpty && row < ROWS; row++) {
                isEmpty = this.getCell(row, col).isEmpty();
                if (isEmpty) {
                    this.getCell(row, col).setToken(token);
                }
            }
        },
        getGrid: function () {
            return [...GRID];
        },
        getColums: function () {
            return COLUMNS;
        },
        getRows: function () {
            return ROWS;
        },
        getCell: function (row, column) {
            return GRID[row][column];
        }
    }
}

function initBoardView() {
    return {
        getSelectedColumn: function (color) {
            return console.readNumber(`Jugador '${color}' dame una columna`) - 1;
        },
        showBoard: function (boardGrid) {
            console.writeln(`-------Conect4-------`);
            for (let col = 0; col < boardGrid[0].length; col++) {
                console.write(`|${col + 1}|`);
            }
            console.writeln(`\n---------------------`);
            for (let row = boardGrid.length - 1; row >= 0; row--) {
                for (let col = 0; col < boardGrid[row].length; col++) {
                    let cell = boardGrid[row][col];
                    if (cell !== undefined) {
                        if (cell.getToken() !== undefined) {
                            console.write(`|${cell.getToken().getColor()}|`);
                        } else {
                            console.write('|O|');
                        }
                    }
                }
                console.writeln();
            }
            console.writeln(`---------------------`);
        },
        showWinner: function (color, winnerCells) {
            console.writeln(`--------------------------------------`);
            console.writeln(`Felicidades '${color}' eres el ganador :-)`);
            for(let i = 0; i < winnerCells.length; i++) {
                let cell = winnerCells[i];
                console.write(`(${cell.getRow()}, ${cell.getColumn()}) `);
            }
            console.writeln(`\n--------------------------------------`);
        },
        showTies: function () {
            console.writeln(`--------------------------------------`);
            console.writeln(`No hay un ganador :-(`);
            console.writeln(`--------------------------------------`);
        },
        askResume: function () {
            let isValidAnswer;
            let answer;
            do {
                answer = console.readString(`¿Quieres jugar otra partida? (s/n):`);
                isValidAnswer = answer === 's' || answer === 'n';
                if (!isValidAnswer) {
                    console.writeln(`--------------------------------------`);
                    console.writeln(`Respuesta incorrecta :-(`);
                    console.writeln(`--------------------------------------`);
                }
            } while (!isValidAnswer);
            return answer;
        }
    }
}

function initPlayer(color) {
    let bot;
    return {
        getColor: function () {
            return color;
        },
        setColor: function (otherColor) {
            color = otherColor;
        },
        getToken: function () {
            return initToken(color);
        },
        isBot() {
            return bot;
        },
        setBot(otherIsBot) {
            bot = otherIsBot;
        }
    }
}

function initCell() {
    let column = 0;
    let row = 0;
    let token;
    return {
        getColumn: function () {
            return column;
        },
        setColumn: function (otheColumn) {
            column = otheColumn;
        },
        getRow: function () {
            return row;
        },
        setRow: function (otherRow) {
            row = otherRow;
        },
        getToken: function () {
            return token;
        },
        setToken: function (otherToken) {
            token = otherToken;
        },
        isEmpty: function () {
            return token === undefined;
        }
    }
}

function initToken(otherColor) {
    let color = otherColor;
    return {
        getColor: function () {
            return color;
        },
        setColor: function (otherColor) {
            color = otherColor;
        }
    }
}


const { Console } = require(`../console-mpds`);
const console = new Console();

createConnect4().play();

function createConnect4() {
    const MAX_PLAYERS = 2;
    const MAX_TURNS = 42;
    let connectedCells;
    let turn;
    let gameView;
    return {
        play: function () {
            do {
                turn = 0;
                gameView = createGameView();
                do {
                    gameView.playTurn(this.nextTurn());
                } while (!this.isWinner(gameView.getCurrentPlayerColor()) && turn < MAX_TURNS);
                if (turn < MAX_TURNS) {
                    gameView.showWinner(gameView.getCurrentPlayerColor(), connectedCells);
                } else {
                    gameView.showTied();
                }
            } while (this.isResumed());
        },
        isResumed: function () {
            return gameView.askResume() === 's';
        },
        isWinner: function (color) {
            const TOKENS_TO_WIN = 4;
            let someConnet4 = false;
            const board = gameView.getBoard();
            for (let row = 0; !someConnet4 && row < board.getRows() - TOKENS_TO_WIN + 1; row++) {
                for (let col = 0; !someConnet4 && col < board.getColums() - TOKENS_TO_WIN + 1; col++) {
                    let leftRight = [];
                    let bottomTop = [];
                    let leftBottomTopRight = [];
                    let bottomRightTopLeft = [];
                    for (let growth = 0; growth < TOKENS_TO_WIN; growth++) {
                        leftRight.push(board.getCell(row, col + growth));
                        bottomTop.push(board.getCell(row + growth, col));
                        leftBottomTopRight.push(board.getCell(row + growth, col + growth));
                        bottomRightTopLeft.push(board.getCell(row + growth, col + TOKENS_TO_WIN - growth - 1));
                    }
                    someConnet4 = isConnet4(leftRight, color) ||
                        isConnet4(bottomTop, color) ||
                        isConnet4(leftBottomTopRight, color) ||
                        isConnet4(bottomRightTopLeft, color);
                }
            }
            return someConnet4;
            function isConnet4(cells, color) {
                let connet4 = true;
                for (let i = 0; i < TOKENS_TO_WIN; i++) {
                    connet4 &&= !cells[i].isEmpty();
                    if (connet4) {
                        connet4 &&= cells[i].getToken().getColor() === color;
                    }
                }
                if (connet4) {
                    connectedCells = [...cells];
                }
                return connet4;
            }
        },
        nextTurn: function () {
            return (turn++) % MAX_PLAYERS;
        }
    }
}

function createGameView() {
    const boardView = createBoardView();
    const playersViews = [createPlayerView('R'), createPlayerView('Y')];
    boardView.show();
    let currePlayerView;
    return {
        playTurn: function (turn) {
            currePlayerView = playersViews[turn];
            const selectetCol = currePlayerView.getCol(boardView.getBoard());
            boardView.getBoard().putToken(selectetCol, currePlayerView.getToken());
            boardView.show();
        },
        showWinner: function (color, winnerCells) {
            console.writeln(`--------------------------------------`);
            console.writeln(`Felicidades '${color}' eres el ganador :-)`);
            for (let i = 0; i < winnerCells.length; i++) {
                let cell = winnerCells[i];
                console.write(`(${cell.getRow()}, ${cell.getCol()}) `);
            }
            console.writeln(`\n--------------------------------------`);
        },
        showTied: function () {
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
        },
        getCurrentPlayerColor: function () {
            return currePlayerView.getColor();
        },
        getBoard: function() {
            return boardView.getBoard();
        }
    }
}

function createPlayerView(color) {
    let player = createPlayer(color);
    let answer;
    do {
        answer = console.readNumber(`[1] Player\n[2] CPU\nSelecciona tipo de jugador para '${player.getColor()}': `);
    } while (answer < 1 || answer > 2)
    player.setAsBot(answer !== 1);
    return {
        getColor: function () {
            return player.getColor();
        },
        getToken: function () {
            return player.getToken();
        },
        getCol: function (board) {
            let col;
            let repead = false;
            do {
                if (player.isBot()) {
                    col = this.getAutoSelectedColumn(board);
                } else {
                    col = this.getSelectedColumn(player.getColor());
                }
                if (board.isValidColumn(col)) {
                    repead = board.isColumnFull(col);
                    if (repead) {
                        console.writeln(`--------------------------------------`);
                        console.writeln(`La columna ${col + 1} esta llena`);
                    }
                } else {
                    console.writeln(`--------------------------------------`);
                    console.writeln(`La columna ${col + 1} no es valida`);
                    repead = true;
                }
            } while (repead)
            return col;
        },
        getSelectedColumn: function (color) {
            return console.readNumber(`Jugador '${color}' dame una columna`) - 1;
        },
        getAutoSelectedColumn: function (board) {
            return Math.floor(Math.random() * board.getColums());
        },
    }
}

function createBoardView() {
    let board = createBoard();
    const EMTY_CELL = '|O|';
    return {
        show: function () {
            console.writeln(`-------Conect4-------`);
            for (let col = 0; col < board.getGrid()[0].length; col++) {
                console.write(`|${col + 1}|`);
            }
            console.writeln(`\n---------------------`);
            for (let row = board.getGrid().length - 1; row >= 0; row--) {
                for (let col = 0; col < board.getGrid()[row].length; col++) {
                    let cell = board.getGrid()[row][col];
                    if (cell !== undefined) {
                        if (cell.getToken() !== undefined) {
                            console.write(`|${cell.getToken().getColor()}|`);
                        } else {
                            console.write(EMPTY_CELL);
                        }
                    }
                }
                console.writeln();
            }
            console.writeln(`---------------------`);
        },
        getBoard: function () {
            return board;
        }
    }
}

function createBoard() {
    const COLUMNS = 7;
    const ROWS = 6;
    const GRID = [];
    for (let row = 0; row < ROWS; row++) {
        GRID[row] = [];
        for (let col = 0; col < COLUMNS; col++) {
            let cell = createCell();
            cell.setRow(row + 1);
            cell.setCol(col + 1);
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
        isColumnFull: function (col) {
            return this.getCell(ROWS - 1, col).getToken() !== undefined;
        },
        isValidColumn: function (col) {
            return col < COLUMNS;
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
        getCell: function (row, col) {
            return GRID[row][col];
        }
    }
}

function createPlayer(color) {
    let bot;
    return {
        getColor: function () {
            return color;
        },
        setColor: function (otherColor) {
            color = otherColor;
        },
        getToken: function () {
            return createToken(color);
        },
        isBot() {
            return bot;
        },
        setAsBot(otherIsBot) {
            bot = otherIsBot;
        }
    }
}

function createCell() {
    let col = 0;
    let row = 0;
    let token;
    return {
        getCol: function () {
            return col;
        },
        setCol: function (otherCol) {
            col = otherCol;
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

function createToken(otherColor) {
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
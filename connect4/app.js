const { Console } = require(`../console-mpds`);
const console = new Console();

initConnect4().play();

function initConnect4() {
    let board;
    let boardView;
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
                boardView = initBoardView();
                boardView.showBoard(board.getGrid());
                do {
                    currentPlayer = players[this.nextTurn()];
                    board.putToken(this.getColumn(currentPlayer), currentPlayer.getToken());
                    boardView.showBoard(board.getGrid());
                } while (!this.isWinner(currentPlayer.getColor()) && turn < MAX_TURNS);

                if (turn < MAX_TURNS) {
                    boardView.showWinner(currentPlayer.getColor(), winnerCells);
                } else {
                    boardView.showTie();
                }
            } while (this.isResumed());
        },
        getColumn: function (play) {
            let col;
            let repead = false;
            do {
                if (play.isBot()) {
                    col = this.getAutoSelectedColumn();
                } else {
                    col = boardView.getSelectedColumn(play.getColor());
                }
                if (board.isValidColumn(col)) {
                    repead = board.isColumnFull(col);
                    if (repead) {
                        boardView.showAlert(`La columna ${col + 1} esta llena`);
                    }
                } else {
                    boardView.showAlert(`La columna ${col + 1} no es valida`);
                    repead = true;
                }
            } while (repead)
            return col;
        },
        isResumed: function () {
            return boardView.askResume() === 's';
        },
        getAutoSelectedColumn: function () {
            return Math.floor(Math.random() * board.getColums());
        },
        isWinner: function (color) {
            const TOKENS_TO_WIN = 4;
            let someConnet4 = false;
            for (let row = 0; !someConnet4 && row < board.getRows() - TOKENS_TO_WIN + 1; row++) {
                for (let col = 0; !someConnet4 && col < board.getColums() - TOKENS_TO_WIN + 1; col++) {
                    let leftRight = [];
                    let bottomTop = [];
                    let bottomLeft = [];
                    let bottomRight = [];
                    for (let cursor = 0; cursor < TOKENS_TO_WIN; cursor++) {
                        leftRight.push(board.getCell(row, col + cursor));
                        bottomTop.push(board.getCell(row + cursor, col));
                        bottomLeft.push(board.getCell(row + cursor, col + cursor));
                        bottomRight.push(board.getCell(row + cursor, col + TOKENS_TO_WIN - cursor - 1));
                    }
                    someConnet4 = isConnet4(leftRight, color) || 
                    isConnet4(bottomTop, color) || 
                    isConnet4(bottomLeft, color) || 
                    isConnet4(bottomRight, color);
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
                    winnerCells = [...cells];
                }
                return connet4;
            }
        },
        nextTurn: function () {
            return (turn++) % MAX_PLAYERS;
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
            cell.setRow(row + 1);
            cell.setColumn(col + 1);
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
            for (let i = 0; i < winnerCells.length; i++) {
                let cell = winnerCells[i];
                console.write(`(${cell.getRow()}, ${cell.getColumn()}) `);
            }
            console.writeln(`\n--------------------------------------`);
        },
        showAlert: function (msg) {
            console.writeln(`--------------------------------------`);
            console.writeln(msg);
            console.writeln(`--------------------------------------`);
        },
        showTie: function () {
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


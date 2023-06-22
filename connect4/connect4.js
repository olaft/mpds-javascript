const { Console } = require(`../console-mpds`);
const console = new Console();

class Player {
    #bot = false;
    #color;
    constructor(color) {
        this.#color = color;
    }

    getColor() {
        return this.#color;
    }

    setColor(color) {
        this.#color = color;
    }

    getToken() {
        return new Token(this.#color);
    }

    isBot() {
        return this.#bot;
    }

    setAsBot(bot) {
        this.#bot = bot;
    }
}

class Cell {
    #col = 0;
    #row = 0;
    #token;

    getCol() {
        return this.#col;
    }

    setCol(col) {
        this.#col = col;
    }

    getRow() {
        return this.#row;
    }

    setRow(row) {
        this.#row = row;
    }

    getToken() {
        return this.#token;
    }

    setToken(token) {
        this.#token = token;
    }

    isEmpty() {
        return this.#token === undefined;
    }

}

class Token {
    #color;

    constructor(color) {
        this.#color = color;
    }

    getColor() {
        return this.#color;
    }

    setColor(color) {
        this.#color = color;
    }

}

class Board {
    #COLUMNS = 7;
    #ROWS = 6;
    #GRID = [];

    constructor() {
        for (let row = 0; row < this.#ROWS; row++) {
            this.#GRID[row] = [];
            for (let col = 0; col < this.#COLUMNS; col++) {
                let cell = new Cell();
                cell.setRow(row + 1);
                cell.setCol(col + 1);
                this.#GRID[row][col] = cell;
            }
        }
    }

    putToken(col, token) {
        let isEmpty = false;
        for (let row = 0; !isEmpty && row < this.#ROWS; row++) {
            isEmpty = this.getCell(row, col).isEmpty();
            if (isEmpty) {
                this.getCell(row, col).setToken(token);
            }
        }
    }

    isColumnFull(col) {
        return this.getCell(this.#ROWS - 1, col).getToken() !== undefined;
    }

    isValidColumn(col) {
        return col < this.#COLUMNS;
    }

    getGrid() {
        return [...this.#GRID];
    }

    getColums() {
        return this.#COLUMNS;
    }

    getRows() {
        return this.#ROWS;
    }

    getCell(row, col) {
        return this.#GRID[row][col];
    }

}

class PlayerView {
    #player;

    constructor(color) {
        this.#player = new Player(color);
        let answer;
        do {
            answer = console.readNumber(`[1] Player\n[2] CPU\nSelecciona tipo de jugador para '${this.#player.getColor()}': `);
        } while (answer < 1 || answer > 2)
        this.#player.setAsBot(answer !== 1);
    }

    getColor() {
        return this.#player.getColor();
    }

    getToken() {
        return this.#player.getToken();
    }

    getCol(board) {
        let col;
        let repead = false;
        do {
            if (this.#player.isBot()) {
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
    }
    
    getSelectedColumn(color) {
        return console.readNumber(`Jugador '${color}' dame una columna`) - 1;
    }

    getAutoSelectedColumn(board) {
        return Math.floor(Math.random() * board.getColums());
    }
}

class BoardView {
    #board;
    #EMPTY_CELL = '|O|';
    constructor() {
        this.#board = new Board();
    }

    show() {
        console.writeln(`-------Conect4-------`);
        for (let col = 0; col < this.#board.getGrid()[0].length; col++) {
            console.write(`|${col + 1}|`);
        }
        console.writeln(`\n---------------------`);
        for (let row = this.#board.getGrid().length - 1; row >= 0; row--) {
            for (let col = 0; col < this.#board.getGrid()[row].length; col++) {
                let cell = this.#board.getGrid()[row][col];
                if (cell !== undefined) {
                    if (cell.getToken() !== undefined) {
                        console.write(`|${cell.getToken().getColor()}|`);
                    } else {
                        console.write(this.#EMPTY_CELL);
                    }
                }
            }
            console.writeln();
        }
        console.writeln(`---------------------`);
    }

    getBoard() {
        return this.#board;
    }

}

class GameView {
    boardView;
    playersViews;
    boardView;
    currePlayerView;
    constructor() {
        this.boardView = new BoardView();
        this.playersViews = [new PlayerView('R'), new PlayerView('Y')];
        this.boardView.show();
    }

    playTurn(turn) {
        this.currePlayerView = this.playersViews[turn];
        const selectetCol = this.currePlayerView.getCol(this.boardView.getBoard());
        this.boardView.getBoard().putToken(selectetCol, this.currePlayerView.getToken());
        this.boardView.show();
    }

    showWinner(color, winnerCells) {
        console.writeln(`--------------------------------------`);
        console.writeln(`Felicidades '${color}' eres el ganador :-)`);
        winnerCells.map(cell => console.write(`(${cell.getRow()}, ${cell.getCol()}) `));
        console.writeln();
    }

    showTied() {
        console.writeln(`--------------------------------------`);
        console.writeln(`No hay un ganador :-(`);
        console.writeln(`--------------------------------------`);
    }

    askResume() {
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

    getCurrentPlayerColor() {
        return this.currePlayerView.getColor();
    }

    getBoard() {
        return this.boardView.getBoard();
    }

}

class Connect4 {
    TOKENS_TO_WIN = 4;
    MAX_PLAYERS = 2;
    MAX_TURNS = 42;
    connectedCells;
    turn;
    gameView;

    constructor() {
        do {
            this.turn = 0;
            this.gameView = new GameView();
            do {
                this.gameView.playTurn(this.nextTurn());
            } while (!this.isWinner(this.gameView.getCurrentPlayerColor()) && this.turn < this.MAX_TURNS);
            if (this.turn < this.MAX_TURNS) {
                this.gameView.showWinner(this.gameView.getCurrentPlayerColor(), this.connectedCells);
            } else {
                this.gameView.showTied();
            }
        } while (this.isResumed());
    }

    isResumed() {
        return this.gameView.askResume() === 's';
    }

    isWinner(color) {
        let someConnet4 = false;
        const board = this.gameView.getBoard();
        for (let row = 0; !someConnet4 && row < board.getRows() - this.TOKENS_TO_WIN + 1; row++) {
            for (let col = 0; !someConnet4 && col < board.getColums() - this.TOKENS_TO_WIN + 1; col++) {
                let rowLine = [];
                let columLine = [];
                let diagonalLeftLine = [];
                let diagonalRightLine = [];
                for (let growth = 0; growth < this.TOKENS_TO_WIN; growth++) {
                    rowLine.push(board.getCell(row, col + growth));
                    columLine.push(board.getCell(row + growth, col));
                    diagonalLeftLine.push(board.getCell(row + growth, col + growth));
                    diagonalRightLine.push(board.getCell(row + growth, col + this.TOKENS_TO_WIN - growth - 1));
                }
                someConnet4 = this.#isConnet4(rowLine, color) ||
                    this.#isConnet4(columLine, color) ||
                    this.#isConnet4(diagonalLeftLine, color) ||
                    this.#isConnet4(diagonalRightLine, color);
            }
        }
        return someConnet4;
    }

    #isConnet4(cells, color) {
        let connet4 = true;
        for (let i = 0; i < this.TOKENS_TO_WIN; i++) {
            connet4 &&= !cells[i].isEmpty();
            if (connet4) {
                connet4 &&= cells[i].getToken().getColor() === color;
            }
        }
        this.connectedCells = (connet4) ? [...cells] : [];
        return connet4;
    }

    nextTurn() {
        return (this.turn++) % this.MAX_PLAYERS;
    }
}

new Connect4();
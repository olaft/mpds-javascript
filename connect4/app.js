const { Console } = require(`../console-mpds`);
const console = new Console();

class Color {
    static RED = new Color("R", "Rojo");
    static YELLOW = new Color("Y", "Amarillo");
    static LESS = new Color("0", "Colorless");

    #name;
    #simbol;
    constructor(simbol, name) {
        this.#name = name;
        this.#simbol = simbol;
    }

    getName() {
        return this.#name;
    }

    getSimbol() {
        return this.#simbol;
    }

    equals(color) {
        return this.#simbol === color.getSimbol() && this.#name === color.getName();
    }
}

class Direction {
    #stepsToNort;
    #stepsToEast;
    static NORT = new Direction(1, 0);
    static NORT_EAST = new Direction(1, 1);
    static EAST = new Direction(0, 1);
    static SOUTH_EAST = new Direction(1, -1);
    static SOUTH = new Direction(-1, 0);
    static SOUTH_WEST = new Direction(-1, -1);
    static WEST = new Direction(0, -1);
    static NORT_WEST = new Direction(-1, 1);

    static ALL_DIRECTIONS = [
        Direction.NORT,
        Direction.NORT_EAST,
        Direction.EAST,
        Direction.SOUTH_EAST,
        Direction.SOUTH,
        Direction.SOUTH_WEST,
        Direction.WEST,
        Direction.NORT_WEST
    ];

    constructor(stepsToEast, stepsToNort) {
        this.#stepsToEast = stepsToEast;
        this.#stepsToNort = stepsToNort;
    }

    getStepsToNort() {
        return this.#stepsToNort;
    }

    getStepsToEast() {
        return this.#stepsToEast;
    }

    getKey() {
        return `[${this.#stepsToEast}, ${this.#stepsToNort}]`
    }

    getInverse() {
        return new Direction(this.#stepsToEast * -1, this.#stepsToNort * -1);
    }

    toString() {
        return `[${this.#stepsToEast}, ${this.#stepsToNort}]`;
    }
}

class Coordinate {
    #col;
    #row;

    constructor(row, col) {
        this.#row = row;
        this.#col = col;
    }

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

    getPrintableRow() {
        return this.#row + 1;
    }

    getPrintableCol() {
        return this.#col + 1;
    }

    getShifted(direction) {
        return new Coordinate(this.getRow() + direction.getStepsToEast(), this.getCol() + direction.getStepsToNort());
    }

    toString() {
        return `Coordinate[${this.getRow()}, ${this.getCol()}]`
    }
}

class Cell extends Coordinate {
    #token;
    #connectedCells;

    constructor(row, col) {
        super(row, col);
        this.#connectedCells = new Map();
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

    addConnection(cells, direction) {
        this.#connectedCells.set(direction.getKey(), cells);
    }

    getConnections() {
        return this.#connectedCells;
    }

    getConnect4Line(directionKey) {
        let connect4Line = new Connect4Line();
        let nextCell = this.#connectedCells.get(directionKey);
        if (nextCell) {
            connect4Line = nextCell.getConnect4Line(directionKey);
        }
        connect4Line.addCell(this);
        return connect4Line;
    }

    samenToken(cell) {
        if (!cell.isEmpty() && !this.isEmpty()) {
            return this.getToken().equals(cell.getToken());
        }
    }

    toString() {
        return `{${(this.#token) ? this.#token.getColor().getSimbol() : ''}}[${this.getPrintableRow()}, ${this.getPrintableCol()}]`
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

    equals(token) {
        return this.#color.equals(token.getColor());
    }
}

class Connect4Line {
    static TOKENS_TO_WIN = 4;
    #cells;

    constructor() {
        this.#cells = [];
    }

    addCell(cell) {
        this.#cells.push(cell);
    }

    getCell(index) {
        return this.#cells[index];
    }

    isConnet4() {
        let connet4 = this.#cells.length >= Connect4Line.TOKENS_TO_WIN;
        return connet4;
    }

    toString() {
        return `Connect4 ${this.#cells.map(cell => cell)}`;
    }
}


class Player {
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

    getSelectedColumn() { };

}

class UserPlayer extends Player {

    constructor(color) {
        super(color);
    }

    getSelectedColumn() {
        return null;
    }
}

class PlayerBot extends Player {
    #board = new Board();
    constructor(color, board) {
        super(color);

        this.#board = board;
    }

    getSelectedColumn() {
        let prioritiCell = new Cell();
        for (let col = 0; col < Board.COLUMNS; col++) {
            if (!this.#board.isColumnFull(col)) {
                let emptyCell = this.#board.getTopEmptyCell(col);
                let coordinate = emptyCell.getShifted(Direction.SOUTH);
                if (this.#board.isItWithin(coordinate)) {
                    let cell = this.#board.getCell(coordinate);
                    if (cell.getConnections().size > prioritiCell.getConnections().size && cell.getConnections().size > 2) {
                        prioritiCell = cell;
                        console.writeln(` ${prioritiCell} size ${prioritiCell.getConnections().size}`);
                    }
                }
            }
        }

        if(!prioritiCell.isEmpty()) {
            return prioritiCell.getCol();
        }
        
        return Math.floor(Math.random() * Board.COLUMNS);
    }

}

class Board {
    static COLUMNS = 7;
    static ROWS = 6;
    #GRID = [];
    #lastFilledCell;
    #connect4Line;

    constructor() {
        this.#connect4Line = new Connect4Line();
        for (let row = 0; row < Board.ROWS; row++) {
            this.#GRID[row] = [];
            for (let col = 0; col < Board.COLUMNS; col++) {
                let cell = new Cell(row, col);
                this.#GRID[row][col] = cell;
            }
        }
    }

    dropToken(col, token) {
        this.#connect4Line = new Connect4Line();
        let cell = this.getTopEmptyCell(col);
        if (cell) {
            cell.setToken(token);
            this.#lastFilledCell = cell;
            this.connectCell(this.#lastFilledCell);
        }
    }

    getTopEmptyCell(col) {
        let emptyCell;
        let isEmpty = false;
        for (let row = 0; !isEmpty && !this.isColumnFull(col) && row < Board.ROWS; row++) {
            let coordinate = new Coordinate(row, col);
            isEmpty = this.getCell(coordinate).isEmpty();
            if (isEmpty) {
                emptyCell = this.getCell(coordinate);
            }
        }
        return emptyCell;
    }

    connectCell(cell) {
        for (let direction of Direction.ALL_DIRECTIONS) {
            let cordinate = cell.getShifted(direction);

            if (this.isItWithin(cordinate)) {
                let nextCell = this.getCell(cordinate);
                if (cell.samenToken(nextCell)) {
                    cell.addConnection(nextCell, direction);
                    nextCell.addConnection(cell, direction.getInverse());

                    let connect4Line = cell.getConnect4Line(direction.getKey());
                    if (!connect4Line.isConnet4()) {
                        connect4Line = nextCell.getConnect4Line(direction.getInverse().getKey())
                    }
                    this.#setConnect4Line(connect4Line);
                }
            }
        }
    }

    #setConnect4Line(connect4Line) {
        this.#connect4Line = connect4Line;
    }

    getConnect4Line() {
        return this.#connect4Line;
    }

    isItWithin(coordinate) {
        return coordinate.getRow() >= 0 && Board.ROWS > coordinate.getRow() &&
            coordinate.getCol() >= 0 && Board.COLUMNS > coordinate.getCol();
    }

    isColumnFull(col) {
        return this.getCell(new Coordinate(Board.ROWS - 1, col)).getToken() !== undefined;
    }

    isValidColumn(col) {
        return col < Board.COLUMNS;
    }

    getGrid() {
        return [...this.#GRID];
    }

    getCell(coordinate) {
        return this.#GRID[coordinate.getRow()][coordinate.getCol()];
    }

    getLastFilledCell() {
        return this.#lastFilledCell;
    }

}

class PlayerView {
    #player;

    constructor(color, board) {
        let answer;

        console.writeln(`------- ${board}`);
        do {
            answer = console.readNumber(`[1] Player\n[2] CPU\nSelecciona tipo de jugador para '${color.getName()}': `);
        } while (answer < 1 || answer > 2)

        this.#player = (answer === 1 ? new UserPlayer(color) : new PlayerBot(color, board));
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
            col = this.#player.getSelectedColumn();
            if (col === null) {
                col = this.getSelectedColumn(this.#player.getColor());
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
        return console.readNumber(`Jugador '${color.getName()}' dame una columna`) - 1;
    }
}

class BoardView {
    #board;
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
                        let color = cell.getToken().getColor();
                        console.write(`|${color.getSimbol()}|`);
                    } else {
                        console.write(`|${Color.LESS.getSimbol()}|`);
                    }
                }
            }
            console.writeln();
        }
        console.writeln(`---------------------`);
    }

    getConnect4Line() {
        return this.#board.getConnect4Line();
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
    #bindMetod;
    constructor(bindMetod) {
        this.#bindMetod = bindMetod;
        this.boardView = new BoardView();
        this.playersViews = [new PlayerView(Color.RED, this.boardView.getBoard()), new PlayerView(Color.YELLOW, this.boardView.getBoard())];
        this.boardView.show();
    }

    playTurn(turn) {
        this.currePlayerView = this.playersViews[turn];
        const selectetCol = this.currePlayerView.getCol(this.boardView.getBoard());
        this.boardView.getBoard().dropToken(selectetCol, this.currePlayerView.getToken());
        this.boardView.show();
        this.#bindMetod(this.boardView.getConnect4Line());
    }

    showWinner(color) {
        console.writeln(`--------------------------------------`);
        console.writeln(`Felicidades '${color.getName()}' eres el ganador :-)`);
        console.write(`(${this.boardView.getConnect4Line()}) `);
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
    #MAX_PLAYERS = 2;
    #MAX_TURNS = 42;
    #turn;
    #gameView;
    #hasWinner;

    play() {
        do {
            this.#turn = 0;
            this.#gameView = new GameView(this.#hasItAWinner.bind(this));
            do {
                this.#gameView.playTurn(this.nextTurn());
            } while (!this.#hasWinner && this.#turn < this.#MAX_TURNS);

            if (this.#turn < this.#MAX_TURNS) {
                this.#gameView.showWinner(this.#gameView.getCurrentPlayerColor());
            } else {
                this.#gameView.showTied();
            }
        } while (this.isResumed());
    }

    isResumed() {
        return this.#gameView.askResume() === 's';
    }

    #hasItAWinner(connect4Line) {
        this.#hasWinner = connect4Line.isConnet4();
    }

    nextTurn() {
        return (this.#turn++) % this.#MAX_PLAYERS;
    }
}

new Connect4().play();
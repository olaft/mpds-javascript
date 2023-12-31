const { Console } = require("../console-mpds");

const console = new Console();
playTicTacToe();


function playTicTacToe() {
    do {
        playGame();
    } while (isResumed());

    function playGame() {
        const MAX_PLAYERS = 2;
        const MAX_TOKENS = 3;
        const TOKEN_EMPTY = ` `;
        let tokens = [
            [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
            [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY],
            [TOKEN_EMPTY, TOKEN_EMPTY, TOKEN_EMPTY]
        ];
        let turn = 0;
        let winner;
        let players = setPlayers();

        do {
            writelnTokens(tokens);
            console.writeln(`Turno para ${getToken(turn)}`);
            placeToken(tokens, players[turn], turn);
            winner = isTicTacToe(tokens, turn);
            if (!winner) {
                turn = nextTurn(turn);
            }
        } while (!winner);

        writelnTokens(tokens);
        console.writeln(`Victoria para ${getToken(turn)}`);

        function setPlayers (){
            let players = [];
            do {
                console.writeln(`Selecciones el tipo de jugador para el jugador ${players.length + 1}:`);
                console.writeln(`[1] Bot`);
                console.writeln(`[2] Persona`);
                const playeyTipe = console.readNumber(`Opción:`);
                switch(playeyTipe) {
                    case 1:
                        players.push(botPlayerTurn);
                        break;
                    case 2:
                        players.push(humanPlayerTurn);
                        break;
                    default:
                        console.writeln(`Opción \"${playeyTipe}\" no es valida`);
                        break;
                }
            } while (players.length< 2)
            return players;
        }

        function writelnTokens(tokens) {
            const HORIZONTAL_SEPARTOR = `-------------`;
            const VERTICAL_SEPARATOR = `|`;
            let msg = ``;
            for (let i = 0; i < tokens.length; i++) {
                msg += `${HORIZONTAL_SEPARTOR}\n`;
                for (let j = 0; j < tokens[i].length; j++) {
                    msg += `${VERTICAL_SEPARATOR} ${tokens[i][j]} `;
                }
                msg += `${VERTICAL_SEPARATOR}\n`;
            }
            msg += HORIZONTAL_SEPARTOR;
            console.writeln(msg);
        }

        function nextTurn(turn) {
            return (turn + 1) % MAX_PLAYERS;
        }

        function placeToken(tokens, turnFunction, turn) {
            const movement = getNumTokens(tokens) === MAX_PLAYERS * MAX_TOKENS;
            turnFunction(movement, turn);
        }

        function humanPlayerTurn(movement, turn) {
            let error;
            let originRow;
            let originColumn;
            if (movement) {
                do {
                    originRow = read(`Fila origen`);
                    originColumn = read(`Columna origen`);
                    error = !isOccupied(tokens, originRow, originColumn, turn);
                    if (error) {
                        console.writeln(`No hay una ficha de la propiedad de ${getToken(turn)}`);
                    } else {
                        tokens[originRow][originColumn] = TOKEN_EMPTY;
                    }

                } while (error);
            }
            let targetRow;
            let targetColumn;
            do {
                targetRow = read(`Fila destino`);
                targetColumn = read(`Columna destino`);
                error = !isEmpty(tokens, targetRow, targetColumn);
                if (error) {
                    console.writeln(`Indique una celda vacía`);
                }
            } while (error);
            
            tokens[targetRow][targetColumn] = getToken(turn);
        }

        function botPlayerTurn(movement, turn) {
            const ROW_COL_MAX_NUMBER = 3;
            console.writeln(`---Bot---`);
            let error;
            let originRow;
            let originColumn;
            if (movement) {
                do {
                    originRow = Math.floor(Math.random() * ROW_COL_MAX_NUMBER);
                    originColumn = Math.floor(Math.random() * ROW_COL_MAX_NUMBER);
                    error = !isOccupied(tokens, originRow, originColumn, turn);
                    if (!error) {
                        tokens[originRow][originColumn] = TOKEN_EMPTY;
                    }
                } while (error);
            }
            let targetRow;
            let targetColumn;
            do {
                targetRow = Math.floor(Math.random() * ROW_COL_MAX_NUMBER);
                targetColumn = Math.floor(Math.random() * ROW_COL_MAX_NUMBER);
                error = !isEmpty(tokens, targetRow, targetColumn);
            } while (error);
            tokens[targetRow][targetColumn] = getToken(turn);
        }

        function getNumTokens(tokens) {
            let empties = 0;
            for (let i = 0; i < tokens.length; i++) {
                for (let j = 0; j < tokens[i].length; j++) {
                    if (tokens[i][j] === TOKEN_EMPTY) {
                        empties++;
                    }
                }
            }
            return MAX_TOKENS ** 2 - empties;
        }

        function read(title) {
            let position;
            let error;
            do {
                position = console.readNumber(`${title}: `);
                error = position < 1 || 3 < position;
                if (error) {
                    console.writeln(`Por favor un numero entre 1 y ${MAX_TOKENS} inclusives`)
                }
            } while (error);
            return position - 1;
        }

        function isEmpty(tokens, row, column) {
            return tokens[row][column] === TOKEN_EMPTY;
        }

        function getToken(turn) {
            const TOKEN_X = `X`;
            const TOKEN_Y = `Y`;
            return turn === 0 ? TOKEN_X : TOKEN_Y;
        }

        function isOccupied(tokens, row, column, turn) {
            return tokens[row][column] === getToken(turn);
        }

        function isTicTacToe(tokens, turn) {
            let countRows = [0, 0, 0];
            let countColumns = [0, 0, 0];
            let countDiagonal = 0;
            let countInverse = 0;
            for (let i = 0; i < tokens.length; i++) {
                for (let j = 0; j < tokens[i].length; j++) {
                    if (tokens[i][j] === getToken(turn)) {
                        countRows[i]++;
                        countColumns[j]++;
                        if (i - j === 0) {
                            countDiagonal++;
                        }
                        if (i + j === MAX_TOKENS - 1) {
                            countInverse++;
                        }
                    }
                }
            }
            if (countDiagonal === MAX_TOKENS || countInverse === MAX_TOKENS) {
                return true;
            }
            for (let i = 0; i < countRows.length; i++) {
                if (countRows[i] === MAX_TOKENS) {
                    return true;
                }
                if (countColumns[i] === MAX_TOKENS) {
                    return true;
                }
            }
            return false;
        }
    }

    function isResumed() {
        let result;
        let answer;
        let error = false;
        do {
            answer = console.readString(`¿Quieres jugar otra partida? `);
            result = answer === `si`;
            error = !result && answer !== `no`;
            if (error) {
                console.writeln(`Por favor, responda "si" o "no"`);
            }
        } while (error);
        return result;
    }

}
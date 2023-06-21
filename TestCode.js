function createTurn() {
    let turn = function () { }

    turn.next = function () {
        turn.counter++;
        return turn.counter
    }

    turn.counter = 0;
    turn.reset = function () {
        turn.counter = 0;
    }

    return turn;
}

let turn = createTurn();

console.log(turn.next());
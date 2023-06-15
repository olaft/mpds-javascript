const { Console } = require(`../console-mpds`);
const console = new Console();

let masterMind = initMasterMind();

do {
    console.writeln(`----- MASTERMIND -----`);
    masterMind.play();
} while (masterMind.isResumed())

function initMasterMind() {
    const board = initBordView();
    return {
        play: function () {
            const secretCombination = this.getSecretCombination();
            let attempts = [];
            let blackPegs;
            do {
                const proposedCombination = board.getProposedCombination();
                this.saveWhiteBlackPegs(proposedCombination, secretCombination);
                blackPegs = proposedCombination.getBlackPegs();
                attempts.push(proposedCombination);
                board.showResults(attempts, secretCombination);
            } while (blackPegs < secretCombination.COMBINATION_LENGTH && attempts.length < secretCombination.MAX_ATTEMPTS);
        },
        getSecretCombination: function () {
            const secretCombination = initConvination();
            let validCombination = [...secretCombination.VALID_COLORS];
            let colors = '';
            for (let i = 1; i <= secretCombination.COMBINATION_LENGTH; i++) {
                let index = Math.floor(Math.random() * validCombination.length);
                colors += validCombination[index];
                validCombination.splice(index, 1);
            } console.writeln(`secretCombination: ${colors}`);
            secretCombination.setColors(colors);
            return secretCombination;
        },
        saveWhiteBlackPegs: function (proposedCombination, secretCombination) {
            let blackPegs = 0;
            for (let i = 0; i < secretCombination.getColors().length; i++) {
                if (proposedCombination.getColors()[i] === secretCombination.getColors()[i]) {
                    blackPegs++;
                }
            }
            proposedCombination.setBlackPegs(blackPegs);
            let whitePegs = 0;
            for (let i = 0; i < proposedCombination.getColors().length; i++) {
                let currentColor = proposedCombination.getColors()[i];
                for (let j = 0; j < secretCombination.getColors().length; j++) {
                    if (currentColor === secretCombination.getColors()[j]) {
                        whitePegs++;
                    }
                }
            }
            proposedCombination.setWhitePegs(whitePegs-blackPegs);
        },
        isResumed: function () {
            return board.askResume() === 's';
        }
    }
}

function initConvination() {
    let colors = '';
    let blackPegs = 0;
    let whitePegs = 0;
    return {
        COMBINATION_LENGTH: 4,
        MAX_ATTEMPTS: 10,
        VALID_COLORS: ['r', 'g', 'b', 'y', 'c', 'm'],
        getColors: function () {
            return colors;
        },
        setColors: function (otherColors) {
            colors = otherColors;
        },
        getBlackPegs: function () {
            return blackPegs;
        },
        setBlackPegs: function (otherBlackPegs) {
            blackPegs = otherBlackPegs;
        },
        getWhitePegs: function () {
            return whitePegs;
        },
        setWhitePegs: function (otherWhitePeg) {
            whitePegs = otherWhitePeg;
        }
    }
}

function initBordView() {
    return {
        showResults: function (attempts, secretCombination) {
            console.writeln(`intento(s): ${attempts.length}`);
            console.writeln(`****`);
            for (let proposedCombination of attempts) {
                console.writeln(`Combinación: ${proposedCombination.getColors()} --> ${proposedCombination.getBlackPegs()} Negras y ${proposedCombination.getWhitePegs()} Blancos`);
                if (proposedCombination.getBlackPegs() == proposedCombination.COMBINATION_LENGTH) {
                    console.writeln(`¡¡¡Has ganado!!! ;-)`);
                } else {
                    if (attempts.length === secretCombination.MAX_ATTEMPTS) {
                        console.writeln(`¡¡¡Has perdido!!! :-( Combinación secreta: ${secretCombination.getColors()}`);
                        return;
                    }
                }
            }
        },
        getProposedCombination: function () {
            const proposedCombination = initConvination();
            let valid;
            do {
                proposedCombination.setColors(console.readString(`Dame la combinación propuesta:`));
                if (proposedCombination.getColors().length != proposedCombination.COMBINATION_LENGTH) {
                    console.writeln(`Longitud de combinación propuesta incorrecto`);
                    valid = false;
                } else {
                    valid = this.validateProposedCombination(proposedCombination);
                    if (!valid) {
                        console.writeln(`Colores incorrectos, deben ser {r, g, y, b, m ó c} y no repetirlos`);
                    }
                }
            } while (!valid);
            return proposedCombination;
        },
        validateProposedCombination: function (proposedCombination) {
            let fullValidation = true;
            for (let i = 0; fullValidation && i < proposedCombination.getColors().length; i++) {
                let currenColor = proposedCombination.getColors()[i];
                let pegValidation = false;
                for (let j = 0; !pegValidation && j < proposedCombination.VALID_COLORS.length; j++) {
                    pegValidation = currenColor === proposedCombination.VALID_COLORS[j];
                }
                let repeated = 0;
                for (let j = 0; j < proposedCombination.getColors().length; j++) {
                    currenColor === proposedCombination.VALID_COLORS[j];
                    if(currenColor === proposedCombination.getColors()[j]) {
                        repeated++;
                    }
                }
                fullValidation &&= pegValidation && repeated <= 1;
            }
            return fullValidation;
        },
        askResume: function () {
            let invalidResult;
            let answer;
            do {
                answer = console.readString(`¿Quieres continuar? (s/n):`);
                invalidResult = answer !== 's' && answer !== 'n';
                if (invalidResult) {
                    console.writeln(`Respuesta incorrecta :-(`);
                }
            } while (invalidResult);
            return answer;
        }
    }
}
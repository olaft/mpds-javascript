@startuml
class Connect4
class Board{
    -GRID:Array
    getGrid()
    getCell()
}

class BoardView {
    showBoard()
}
class Player {
    -color
    getToken()
    getColor()
}
class Cell {
    -token
    getToken()
    setToken()
}
class Token
enum Color{
}
Connect4 *--> "1" Board
Connect4 *--> "1" BoardView
Connect4 *--> "2" Player
BoardView ..> Cell
Player o--> Token
Token *--> Color
Player ..> Color

Board *--> "0..6x7" Cell
Cell *--> "1" Token
@enduml
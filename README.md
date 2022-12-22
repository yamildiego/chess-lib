# Chess Lib

Chess Lib is a library that allows us emulate a game of chess.

## Installation

```sh
npm install yd-chess-lib
```

## Getting started with Chess Lib

Here is an example of a basic app using Chess Lib:

```js
import Chess from "yd-chess-lib";

let chess = Chess.getInstance();
```

## Public Methods

To access the library you have to call "**getInstance()**" in every call. We implement a Singleton, to avoid duplicating data.

### getInstance

```ts
getInstance();
```

```js
import Chess from "yd-chess-lib";

let chess = Chess.getInstance();
```

### printChessboardToConsole

Print the chessboard in the console.

```ts
printChessboardToConsole = () => void;
```

```js
import Chess from "yd-chess-lib";

let chess = Chess.getInstance();

//print chessboard
chess.printChessboardToConsole();
```

### move

Moves the piece located in square **from** to square **to**. Only if it is a valid and allowed move. Return true if the move was made.

```ts
move = (from: String, to: string) => boolean; || move = (movement: string) => boolean;
```

```js
import Chess from "yd-chess-lib";

let chess = Chess.getInstance();

//print chessboard
chess.printChessboardToConsole();

// moving 2d => 4d
chess.move("2d", "4d"); //return true
chess.printChessboardToConsole();

// moving 2b => 3b
chess.move("2bx3b"); //return true
chess.printChessboardToConsole();

// moving 2c => 5c
chess.move("2cx5c"); //return false (invalid or not allowed movement)
chess.printChessboardToConsole();
```

Result

```sh
//Default chessboard     //moved 2d => 4d         //moved 2b => 3b         //invalid move
RB|NB|BB|QB|KB|BB|NB|RB  RB|NB|BB|QB|KB|BB|NB|RB  RB|NB|BB|QB|KB|BB|NB|RB  RB|NB|BB|QB|KB|BB|NB|RB
PB|PB|PB|PB|PB|PB|PB|PB  PB|PB|PB|PB|PB|PB|PB|PB  PB|PB|PB|PB|PB|PB|PB|PB  PB|PB|PB|PB|PB|PB|PB|PB
50|51|52|53|54|55|56|57  50|51|52|53|54|55|56|57  50|51|52|53|54|55|56|57  50|51|52|53|54|55|56|57
40|41|42|43|44|45|46|47  40|41|42|43|44|45|46|47  40|41|42|43|44|45|46|47  40|41|42|43|44|45|46|47
30|31|32|33|34|35|36|37  30|31|32|PW|34|35|36|37  30|31|32|PW|34|35|36|37  30|31|32|PW|34|35|36|37
20|21|22|23|24|25|26|27  20|21|22|23|24|25|26|27  20|PW|22|23|24|25|26|27  20|PW|22|23|24|25|26|27
PW|PW|PW|PW|PW|PW|PW|PW  PW|PW|PW|13|PW|PW|PW|PW  PW|11|PW|13|PW|PW|PW|PW  PW|11|PW|13|PW|PW|PW|PW
RW|NW|BW|QW|KW|BW|NW|RW  RW|NW|BW|QW|KW|BW|NW|RW  RW|NW|BW|QW|KW|BW|NW|RW  RW|NW|BW|QW|KW|BW|NW|RW
```

### getSquare

We get the piece by passing the position.

```ts
getSquare = (position: string) => boolean;
```

```js
let chess = Chess.getInstance();
//pawn
let square_2_d = chess.getSquare("2d");
console.log(square_2_d);
```

Result

```sh
{ key: "2d", color: "W", type: "P", movementsAllowed: ["3d", "4d"], neverMoved: true }
```

```js
let chess = Chess.getInstance();
//empty square
let square_5_c = chess.getSquare("fc");
console.log(square_5_c);
```

Result

```JSON
null
```

### getChessboard

We get the all chessboard.

```ts
getChessboard = () :
  Array<Array<{ key: string; color: string; type: string; movementsAllowed: Array<string>; neverMoved: boolean } | null>>;
```

```js
let chess = Chess.getInstance();
let chessboard = chess.getChessboard();
console.log(chessboard);
```

Result

```txt
[
  [
    {
      key: '1a',
      color: 'W',
      type: 'R',
      movementsAllowed: [],
      neverMoved: true
    },
    {
      key: '1b',
      color: 'W',
      type: 'N',
      movementsAllowed: ["3c", "3a"],
      neverMoved: true
    },
    ...
```

### getHistory

We get an arrays with all the movements made in order that were made.

```ts
getHistory = (): Array<string>;
```

```js
let history = chess.getHistory();
console.log(history);
```

Result

```JSON
["2dx4d", "2bx3b"]
```

### isInCheckMate

This function return a boolean with value true is the color is in checkmate. Parameter color "W" (White) "B" (Black)

```ts
isInCheckMate = (color: Color): boolean;
```

```js
chess.isInCheckMate("W"); // check if white is in checkmate
chess.isInCheckMate("B"); // check if black is in checkmate
```

### replacePawn

This function allow us to replace the pawn if is in the end of the rows for a Queen(Q), Rook(R), Bishop(B) or Knight(N).

```ts
pawnPromotion = (pawn_key: string, type_of_piece: TypeOfPiece): void
```

```js
chess.replacePawn("1b", "Q");
chess.replacePawn("8a", "N");
```

### isDraw

This function evaluates if it’s a draw returns a string with the type of draw. if isn’t a draw return null.
p_color is the color that it is turn to play

```ts
isDraw = (p_color: Color): string | null
```

```js
chess.isDraw("W"); //   "Slatemate"
chess.isDraw("W"); //   "Dead Position"
chess.isDraw("W"); //   "Repetition"
chess.isDraw("W"); //   null
```

### isCasteling

This function evaluates the board and return a boolean with the value true if it can castling.

```ts
isCasteling = (kingPosition: string, rookPosition: string): boolean
```

```js
chess.isCasteling("1e", "1h"); //   true
chess.isCasteling("1e", "1h"); //   false (may does not meet all requirements)
chess.isCasteling("1e", "1b"); //   false
```

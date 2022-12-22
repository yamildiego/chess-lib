import { tPosSN, tPosNS } from "./commonFunctions";
import loadMovementsAllowed from "./movements/loadMovementsAllowed";
import { ChessType, TypeOfPiece, PieceType, Color, RepeatType } from "./types";
import { lettersIndex, positionsIndex } from "./constant";
import isItInCheck from "./movements/isItInCheck";
import enPassantMovement from "./movements/perPiece/enPassantMovement";

let piece = { key: "", color: null, type: TypeOfPiece.PAWN, movementsAllowed: [], neverMoved: true };

/** Chess board - Initial position  */
const initialPosition = [
  [
    { ...piece, color: Color.WHITE, type: TypeOfPiece.ROOK, key: `1a` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.KNIGHT, key: `1b` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.BISHOP, key: `1c` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.QUEEN, key: `1d` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.KING, key: `1e` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.BISHOP, key: `1f` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.KNIGHT, key: `1g` },
    { ...piece, color: Color.WHITE, type: TypeOfPiece.ROOK, key: `1h` },
  ],
  [
    { ...piece, color: Color.WHITE, key: `2a` },
    { ...piece, color: Color.WHITE, key: `2b` },
    { ...piece, color: Color.WHITE, key: `2c` },
    { ...piece, color: Color.WHITE, key: `2d` },
    { ...piece, color: Color.WHITE, key: `2e` },
    { ...piece, color: Color.WHITE, key: `2f` },
    { ...piece, color: Color.WHITE, key: `2g` },
    { ...piece, color: Color.WHITE, key: `2h` },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { ...piece, color: Color.BLACK, key: `7a` },
    { ...piece, color: Color.BLACK, key: `7b` },
    { ...piece, color: Color.BLACK, key: `7c` },
    { ...piece, color: Color.BLACK, key: `7d` },
    { ...piece, color: Color.BLACK, key: `7e` },
    { ...piece, color: Color.BLACK, key: `7f` },
    { ...piece, color: Color.BLACK, key: `7g` },
    { ...piece, color: Color.BLACK, key: `7h` },
  ],
  [
    { ...piece, color: Color.BLACK, type: TypeOfPiece.ROOK, key: `8a` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.KNIGHT, key: `8b` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.BISHOP, key: `8c` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.QUEEN, key: `8d` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.KING, key: `8e` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.BISHOP, key: `8f` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.KNIGHT, key: `8g` },
    { ...piece, color: Color.BLACK, type: TypeOfPiece.ROOK, key: `8h` },
  ],
];

class Chess {
  private static instance: Chess;
  private board: Array<Array<PieceType | null>>;
  private history: Array<string> = [];
  private movementsRepeated: Array<RepeatType>;
  private counter50Momements: { [Color.WHITE]: number; [Color.BLACK]: number };

  private constructor(p_board: Array<Array<PieceType | null>>) {
    this.history = [];
    this.movementsRepeated = [];
    this.counter50Momements = { [Color.WHITE]: 0, [Color.BLACK]: 0 };
    this.board = loadMovementsAllowed(p_board, true, this.history);
  }

  public static getInstance(p_board?: Array<Array<PieceType | null>>) {
    if (!Chess.instance) {
      if (p_board) Chess.instance = new Chess(p_board);
      else Chess.instance = new Chess(JSON.parse(JSON.stringify(initialPosition)));
    }

    return Chess.instance;
  }

  /**
   * return the board as string for debbunging
   * p_board Array<Array<PieceType | null>> ...
   */
  getBoardInText = (): string => {
    let rowText = "";
    this.board.forEach((row: Array<PieceType | null>, indexRow: number) => {
      let textrow = "";
      row.forEach((square: PieceType | null, indexSquare: number) => {
        textrow += "|";
        if (square !== null) textrow += square.type + square.color;
        else textrow += indexRow + "" + indexSquare;
      });
      rowText = textrow + "\n" + rowText;
      // rowText = "\n" + rowText;
    });

    return rowText;
  };

  /** reStart
   * restart the game. back the pieces to default positions
   */
  reStart = (): void => {
    this.history = [];
    this.movementsRepeated = [];
    this.counter50Momements = { [Color.WHITE]: 0, [Color.BLACK]: 0 };
    this.board = loadMovementsAllowed(JSON.parse(JSON.stringify(initialPosition)), true, this.history);
  };

  /**
   * Excute a list of movement
   */
  resumeGame = (movements: Array<string>): void => {
    movements.forEach((movement) => this.move(movement));
  };

  /**
   * return the board
   * p_board Array<Array<PieceType | null>> ...
   */
  getChessboard = (): Array<Array<PieceType | null>> => this.board;

  /**
   * getHistory return all the movements example ["2dx3d", "5fx6g", "3ax3g"]
   */
  getHistory = (): Array<string> => this.history;

  /**
   * getItem get the item by position string example "1d", "5f", "3a"
   */
  getSquare = (p_position: string): PieceType | null => {
    let pos = tPosSN(p_position);
    let positionValidated = pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
    return positionValidated ? this.board[pos.x][pos.y] : null;
  };

  /**
   * isInCheckMate return true if its in checkmate
   */
  isInCheckMate = (color: Color): boolean => {
    let isInCheckMate = isItInCheck(this.board, color);

    //check is checkmate if theare at leat one movement allow is not in checkmate
    if (isInCheckMate) isInCheckMate = this.#hasNoneLegalMovements(color);

    return isInCheckMate;
  };

  #hasNoneLegalMovements = (color: Color): boolean => {
    let hasNoneLegalMovements = true;
    this.board.forEach((row: Array<PieceType | null>, indexRow: number) => {
      if (hasNoneLegalMovements == true) {
        row.forEach((square: PieceType | null, indexSquare: number) => {
          if (hasNoneLegalMovements == true && square !== null && square.color == color)
            hasNoneLegalMovements = square.movementsAllowed.length == 0;
        });
      }
    });

    return hasNoneLegalMovements;
  };

  /**
   * Replace pawn to other piece
   */
  pawnPromotion = (p_pawn_key: string, p_type_of_piece: TypeOfPiece): void => {
    let pos = tPosSN(p_pawn_key);
    let piece = this.board[pos.x][pos.y];

    if (
      piece !== null &&
      piece.type == TypeOfPiece.PAWN &&
      (p_type_of_piece == TypeOfPiece.QUEEN ||
        p_type_of_piece == TypeOfPiece.ROOK ||
        p_type_of_piece == TypeOfPiece.BISHOP ||
        p_type_of_piece == TypeOfPiece.KNIGHT)
    )
      if ((piece.color === Color.BLACK && pos.x === 7) || (piece.color === Color.WHITE && pos.x === 0)) {
        this.board[pos.x][pos.y] = { key: p_pawn_key, color: piece.color, type: p_type_of_piece, movementsAllowed: [], neverMoved: false };
        loadMovementsAllowed(this.board, true, this.history);
      }
  };

  /**
   * Move - move a piece in the board according to p_movement
   * p_board Array<Array<PieceType | null>> ...
   * p_movement string examples: ["2dX3d", "1ax3c", "5aX8a"]
   */
  move = (p_from_movement: string, p_to_movement?: string): boolean => {
    let moved = false;
    let p_movement = p_from_movement;

    if (p_to_movement !== undefined) p_movement = `${p_from_movement}x${p_to_movement}`;

    let movements: Array<string> = p_movement.toLowerCase().split("x");

    if (movements.length === 2) {
      let positionFrom = tPosSN(movements[0]);
      let positionTo = tPosSN(movements[1]);

      //Evaluate its "from" is a valid square
      let positionFromValidated = positionFrom.x >= 0 && positionFrom.x < 8 && positionFrom.y >= 0 && positionFrom.y < 8;
      //Evaluate its "to" is a valid square
      let positionToValidated = positionTo.x >= 0 && positionTo.x < 8 && positionTo.y >= 0 && positionTo.y < 8;

      if (positionFromValidated && positionToValidated) {
        let item_1 = this.board[positionFrom.x][positionFrom.y];
        let item_2 = this.board[positionTo.x][positionTo.y];

        //Evaluate if the move is En Passant
        if (item_1 !== null && item_1.type === TypeOfPiece.PAWN) {
          let enPassant = enPassantMovement(this.board, item_1, this.history);

          if (enPassant !== null) {
            let posOpponent = tPosSN(enPassant);
            //reset the repetitions because I change the board
            this.movementsRepeated = [];
            this.counter50Momements = { [Color.WHITE]: 0, [Color.BLACK]: 0 };
            //delete the opponent and make a simple move
            this.board[positionFrom.x][posOpponent.y] = null;
          }
        }

        //Evaluate if the move is a castling
        if (
          item_1 !== null &&
          item_1.neverMoved &&
          item_2 !== null &&
          item_2.neverMoved &&
          item_1.type === TypeOfPiece.KING &&
          item_2.type === TypeOfPiece.ROOK
        ) {
          switch (p_movement.toLowerCase()) {
            case "1ex1a":
            case "8ex8a":
              moved = this.#castlingMove(item_2, item_1, { item_1: "d", item_2: "c" });
              break;
            case "1ex1h":
            case "8ex8h":
              moved = this.#castlingMove(item_2, item_1, { item_1: "f", item_2: "g" });
              break;
            default:
              break;
          }
        } else moved = this.#simpleMove(item_1, movements);

        if (moved && item_1 !== null) {
          this.history.push(p_movement);
          loadMovementsAllowed(this.board, true, this.history);

          // clone the board without the property "neverMoved" and updateRepetitions
          let oldBoard = JSON.parse(JSON.stringify(this.board)).map((row: Array<PieceType | null>) => {
            return row.map((square: PieceType | null) => {
              if (square !== null) delete square.neverMoved;
              return square;
            });
          });

          this.#updateRepetitions(item_1.color, JSON.stringify(oldBoard));
        }
      }
    }

    return moved;
  };

  #castlingMove = (p_item_1: PieceType, p_item_2: PieceType, destination: { item_1: string; item_2: string }): boolean => {
    let item_1 = JSON.parse(JSON.stringify(p_item_1));
    let item_2 = JSON.parse(JSON.stringify(p_item_2));

    let posOrigin = tPosSN(p_item_1.key);
    let posToMove = tPosSN(p_item_2.key);

    this.board[posOrigin.x][posOrigin.y] = null;
    this.board[posToMove.x][posToMove.y] = null;

    item_1.key = posToMove.x + 1 + destination.item_1;
    item_1.neverMoved = false;
    item_2.key = posToMove.x + 1 + destination.item_2;
    item_2.neverMoved = false;

    this.board[posToMove.x][tPosSN(item_1.key).y] = item_1;
    this.board[posToMove.x][tPosSN(item_2.key).y] = item_2;

    this.movementsRepeated = [];
    this.counter50Momements[p_item_1.color]++;

    return true;
  };

  #simpleMove = (item: PieceType | null, movements: Array<string>): boolean => {
    let posOrigin = tPosSN(movements[0]);
    let posToMove = tPosSN(movements[1]);

    let moved = false;
    if (item !== null && item.key === movements[0] && item.movementsAllowed.includes(movements[1])) {
      if (this.board[posToMove.x][posToMove.y] !== null) this.movementsRepeated = [];

      if (item.type === TypeOfPiece.PAWN || this.board[posToMove.x][posToMove.y] !== null)
        this.counter50Momements = { [Color.WHITE]: 0, [Color.BLACK]: 0 };
      else this.counter50Momements[item.color]++;

      item.key = movements[1];
      this.board[posToMove.x][posToMove.y] = { ...item, neverMoved: false };
      this.board[posOrigin.x][posOrigin.y] = null;
      moved = true;
    }
    return moved;
  };

  #updateRepetitions = (color: Color, oldBoard: string) => {
    let added = false;
    this.movementsRepeated.forEach((movement) => {
      if (movement.color === color && movement.oldBoard == oldBoard) {
        movement.repetitions += 1;
        added = true;
      }
    });

    if (!added) this.movementsRepeated.push({ color: color, oldBoard, repetitions: 1 });
  };

  isDraw = (color: Color): string | null => {
    let result = null;

    if (this.isDrawBySlatemate(color)) result = "Slatemate";
    if (this.isDrawByInsufficientMaterial()) result = "Dead Position";
    if (this.isDrawByRepetition(color)) result = "Repetition";
    if (this.isDrawBy50MoveRule()) result = "50 Move Rule";

    return result;
  };

  /**
   * isSlatemate return true if its a draw by isSlatemate
   */
  isDrawBySlatemate = (color: Color): boolean => {
    let isADraw = false;
    let isInCheckMate = isItInCheck(this.board, color);

    if (!isInCheckMate && this.#hasNoneLegalMovements(color)) isADraw = true;

    return isADraw;
  };

  isDrawByInsufficientMaterial = (): boolean => {
    let isDrawByInsufficientMaterial = false;
    let kingWhite = this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.KING).length;
    let bishopWhite = this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.BISHOP).length;
    let knightWhite = this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.KNIGHT).length;
    let rookWhite = this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.ROOK).length;
    let queenWhite = this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.QUEEN).length;
    let pawnWhite = this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.PAWN).length;

    let kingBlack = this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.KING).length;
    let bishopBlack = this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.BISHOP).length;
    let knightBlack = this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.KNIGHT).length;
    let rookBlack = this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.ROOK).length;
    let queenBlack = this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.QUEEN).length;
    let pawnBlack = this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.PAWN).length;

    let whitePieces = kingWhite + bishopWhite + knightWhite;
    let blackPieces = kingBlack + bishopBlack + knightBlack;
    let otherPieces = rookWhite + queenWhite + pawnWhite + rookBlack + queenBlack + pawnBlack;

    if (otherPieces == 0) {
      if (whitePieces == 1 && blackPieces == 1) isDrawByInsufficientMaterial = true;
      if (whitePieces == 2 && blackPieces == 1) isDrawByInsufficientMaterial = true;
      if (whitePieces == 1 && blackPieces == 2) isDrawByInsufficientMaterial = true;
      if (whitePieces == 2 && blackPieces == 2 && bishopBlack == 1 && bishopWhite == 1) {
        let positionWhite = tPosSN(this.#getElementsByColorAndType(Color.WHITE, TypeOfPiece.BISHOP)[0].key);
        let positionBlack = tPosSN(this.#getElementsByColorAndType(Color.BLACK, TypeOfPiece.BISHOP)[0].key);

        if ((positionWhite.x + positionWhite.y) % 2 == (positionBlack.x + positionBlack.y) % 2) isDrawByInsufficientMaterial = true;
      }
    }

    return isDrawByInsufficientMaterial;
  };

  isDrawByRepetition = (color: Color): boolean =>
    this.movementsRepeated.filter((item) => item.color == color && item.repetitions >= 3).length > 0;

  isDrawBy50MoveRule = (): boolean => this.counter50Momements[Color.WHITE] >= 50 && this.counter50Momements[Color.BLACK] >= 50;

  #getElementsByColorAndType = (color: Color, type: TypeOfPiece): Array<PieceType> => {
    let result: Array<PieceType> = [];

    this.board.forEach((row: Array<PieceType | null>, indexRow: number) => {
      result = result.concat(row.filter((square): square is PieceType => square !== null && square.type == type && square.color == color));
    });

    return result;
  };
}

module.exports = Chess;
module.exports.tPosNS = tPosNS;
module.exports.tPosSN = tPosSN;
module.exports.TypeOfPiece = TypeOfPiece;
module.exports.Color = Color;

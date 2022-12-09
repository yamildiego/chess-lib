import { tPosSN, tPosNS } from "./commonFunctions";
import loadMovementsAllowed from "./movements/loadMovementsAllowed";
import { ChessType, TypeOfPiece, PieceType, Color } from "./types";
import { lettersIndex, positionsIndex } from "./constant";

let piece = { key: "", color: null, type: TypeOfPiece.PAWN, movementsAllowed: [], neverMoved: true };

/** Chess board - Initial position  */
export const initialPosition = [
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
  private history: Array<string>;

  private constructor(p_board: Array<Array<PieceType | null>>) {
    this.board = loadMovementsAllowed(p_board, true);
    this.history = [];
  }

  public static getInstance(p_board?: Array<Array<PieceType | null>>) {
    if (!Chess.instance) {
      if (p_board) Chess.instance = new Chess(p_board);
      else Chess.instance = new Chess(initialPosition);
    }

    return Chess.instance;
  }

  printChessboardToConsole = () => console.log(this.#getBoardInText());

  /**
   * return the board as string for debbunging
   * p_board Array<Array<PieceType | null>> ...
   */
  #getBoardInText = (): string => {
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

  /**
   * return the board
   * p_board Array<Array<PieceType | null>> ...
   */
  getChessboard = (): Array<Array<PieceType | null>> => this.board;

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
        let item_1 = this.board[tPosSN(movements[0]).x][tPosSN(movements[0]).y];
        let item_2 = this.board[tPosSN(movements[1]).x][tPosSN(movements[1]).y];
        //Evaluate if the move is a castling
        if (
          item_1 !== null &&
          item_1.neverMoved &&
          item_2 !== null &&
          item_2.neverMoved &&
          ((item_1.type === TypeOfPiece.KING && item_2.type === TypeOfPiece.ROOK) ||
            (item_1.type === TypeOfPiece.ROOK && item_2.type === TypeOfPiece.KING))
        ) {
          switch (p_movement.toLowerCase()) {
            case "1ax1e":
            case "8ax8e":
              moved = this.#castlingMove(item_1, item_2, { item_1: "d", item_2: "c" });
              break;
            case "1hx1e":
            case "8hx8e":
              moved = this.#castlingMove(item_1, item_2, { item_1: "f", item_2: "g" });
              break;
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
      }
    }

    if (moved) {
      this.history.push(p_movement);
      loadMovementsAllowed(this.board, true);
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

    return true;
  };

  #simpleMove = (item: PieceType | null, movements: Array<string>): boolean => {
    let posOrigin = tPosSN(movements[0]);
    let posToMove = tPosSN(movements[1]);

    let moved = false;
    if (item !== null && item.key === movements[0] && item.movementsAllowed.includes(movements[1])) {
      item.key = movements[1];
      this.board[posToMove.x][posToMove.y] = { ...item, neverMoved: false };
      this.board[posOrigin.x][posOrigin.y] = null;
      moved = true;
    }
    return moved;
  };

  /**
   * getHistory return all the movements example ["2dx3d", "5fx6g", "3ax3g"]
   */
  getHistory = (): Array<string> => {
    return this.history;
  };

  /**
   * getItem get the item by position string example "1d", "5f", "3a"
   */
  getSquare = (p_position: string): PieceType | null => {
    let pos = tPosSN(p_position);
    let positionValidated = pos.x >= 0 && pos.x < 8 && pos.y >= 0 && pos.y < 8;
    return positionValidated ? this.board[pos.x][pos.y] : null;
  };
}

module.exports = Chess;
module.exports.tPosNS = tPosNS;
module.exports.tPosSN = tPosSN;
module.exports.TypeOfPiece = TypeOfPiece;

let chess = Chess.getInstance();

import { PieceType, TypeOfPiece, Color } from "../types";
import { tPosSN } from "../commonFunctions";

import getPawnMovements from "./perPiece/pawn";
import getBishopMovements from "./perPiece/bishop";
import getRookMovements from "./perPiece/rook";
import getKnightMovements from "./perPiece/knight";
import getKingMovements from "./perPiece/king";
import getQueenMovements from "./perPiece/queen";

import loadMovementsAllowed from "./loadMovementsAllowed";
import isItInCheck from "./isItInCheck";

const loadMovementsAllowedPerSquare = (board: Array<Array<PieceType | null>>, item: PieceType, isFirstRun: boolean): Array<string> => {
  let movementsAllowed: Array<string> = [];

  switch (item.type) {
    case TypeOfPiece.PAWN:
      movementsAllowed = getPawnMovements(board, item);
      break;
    case TypeOfPiece.BISHOP:
      movementsAllowed = getBishopMovements(board, item);
      break;
    case TypeOfPiece.ROOK:
      movementsAllowed = getRookMovements(board, item);
      break;
    case TypeOfPiece.KNIGHT:
      movementsAllowed = getKnightMovements(board, item);
      break;
    case TypeOfPiece.KING:
      movementsAllowed = getKingMovements(board, item);
      break;
    case TypeOfPiece.QUEEN:
      movementsAllowed = getQueenMovements(board, item);
      break;
    default:
      break;
  }

  if (isFirstRun) {
    let cloneBoard = JSON.parse(JSON.stringify(board));
    // Remove movements that put me in check
    let movementsAllowedFiltered: Array<string> = [];
    movementsAllowed.forEach((possiblePositionString: string) => {
      // Evaluate possible castling
      switch (item.type) {
        case TypeOfPiece.KING:
          if (evalCastlingFromKing(cloneBoard, item, possiblePositionString)) movementsAllowedFiltered.push(possiblePositionString);
          break;
        case TypeOfPiece.ROOK:
          if (evalCastlingFromRook(cloneBoard, item, possiblePositionString)) movementsAllowedFiltered.push(possiblePositionString);
          break;
        default:
          if (notInCheck(cloneBoard, item, possiblePositionString)) movementsAllowedFiltered.push(possiblePositionString);
          break;
      }
    });
    return movementsAllowedFiltered;
  } else return movementsAllowed;
};

const notInCheck = (p_board: Array<Array<PieceType | null>>, p_item: PieceType, possiblePositionString: string): boolean => {
  //clone the board to simulate the move
  let testBoard = JSON.parse(JSON.stringify(p_board));
  let testItem = JSON.parse(JSON.stringify(p_item));

  let possiblePosition = tPosSN(possiblePositionString);
  let currentPosition = tPosSN(p_item.key);
  testItem.key = possiblePositionString;

  testBoard[currentPosition.x][currentPosition.y] = null;
  testBoard[possiblePosition.x][possiblePosition.y] = p_item;
  testBoard = loadMovementsAllowed(testBoard, false);
  return !isItInCheck(testBoard, testItem.color);
};

const evalCastlingFromKing = (p_board: Array<Array<PieceType | null>>, p_item: PieceType, possiblePositionString: string): boolean => {
  let row = p_item.color === Color.WHITE ? 1 : 8;

  let inCheck = false;

  if (p_item.neverMoved)
    switch (possiblePositionString) {
      case "1a":
      case "8a":
        inCheck = notInCheck(p_board, p_item, `${row}c`);
        break;
      case "1h":
      case "8h":
        inCheck = notInCheck(p_board, p_item, `${row}g`);
        break;
      default:
        inCheck = notInCheck(p_board, p_item, possiblePositionString);
        break;
    }
  else inCheck = notInCheck(p_board, p_item, possiblePositionString);

  return inCheck;
};

const evalCastlingFromRook = (p_board: Array<Array<PieceType | null>>, p_item: PieceType, possiblePositionString: string): boolean => {
  let row = p_item.color === Color.WHITE ? 0 : 7;
  let king = p_board[row] && p_board[row][4] ? p_board[row][4] : null;
  let inCheck = false;
  let column = p_item.key.substring(1, 2);

  if (p_item.neverMoved && king !== null)
    switch (possiblePositionString) {
      case "1e":
      case "8e":
        if (column == "a") inCheck = notInCheck(p_board, king, `${row + 1}c`);
        if (column == "h") inCheck = notInCheck(p_board, king, `${row + 1}g`);
        break;
      default:
        inCheck = notInCheck(p_board, p_item, possiblePositionString);
        break;
    }
  else inCheck = notInCheck(p_board, p_item, possiblePositionString);

  return inCheck;
};

export default loadMovementsAllowedPerSquare;

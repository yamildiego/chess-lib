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

const loadMovementsAllowedPerSquare = (
  board: Array<Array<PieceType | null>>,
  item: PieceType,
  isFirstRun: boolean,
  history: Array<string>
): Array<string> => {
  let movementsAllowed: Array<string> = [];

  switch (item.type) {
    case TypeOfPiece.PAWN:
      movementsAllowed = getPawnMovements(board, item, history);
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
          if (evalCastlingFromKing(cloneBoard, item, possiblePositionString, history))
            movementsAllowedFiltered.push(possiblePositionString);
          break;
        default:
          if (notInCheck(cloneBoard, item, possiblePositionString, history)) movementsAllowedFiltered.push(possiblePositionString);
          break;
      }
    });
    return movementsAllowedFiltered;
  } else return movementsAllowed;
};

const notInCheck = (
  p_board: Array<Array<PieceType | null>>,
  p_item: PieceType,
  possiblePositionString: string,
  history: Array<string>
): boolean => {
  //clone the board to simulate the move
  let testBoard = JSON.parse(JSON.stringify(p_board));
  let testItem = JSON.parse(JSON.stringify(p_item));

  let possiblePosition = tPosSN(possiblePositionString);
  let currentPosition = tPosSN(p_item.key);
  testItem.key = possiblePositionString;

  testBoard[currentPosition.x][currentPosition.y] = null;
  testBoard[possiblePosition.x][possiblePosition.y] = p_item;
  testBoard = loadMovementsAllowed(testBoard, false, history);
  return !isItInCheck(testBoard, testItem.color);
};

const evalCastlingFromKing = (
  p_board: Array<Array<PieceType | null>>,
  p_item: PieceType,
  possiblePositionString: string,
  history: Array<string>
): boolean => {
  let row = p_item.color === Color.WHITE ? 1 : 8;

  let inCheck = false;

  if (p_item.neverMoved)
    switch (possiblePositionString) {
      case "1a":
      case "8a":
        if (!isItInCheck(p_board, p_item.color))
          inCheck = notInCheck(p_board, p_item, `${row}d`, history) && notInCheck(p_board, p_item, `${row}c`, history);
        break;
      case "1h":
      case "8h":
        if (!isItInCheck(p_board, p_item.color))
          inCheck = notInCheck(p_board, p_item, `${row}f`, history) && notInCheck(p_board, p_item, `${row}g`, history);
        break;
      default:
        inCheck = notInCheck(p_board, p_item, possiblePositionString, history);
        break;
    }
  else inCheck = notInCheck(p_board, p_item, possiblePositionString, history);

  return inCheck;
};

export default loadMovementsAllowedPerSquare;

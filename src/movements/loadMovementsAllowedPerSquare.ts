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
    //remove movements that put me in check
    let movementsAllowedFiltered: Array<string> = [];

    movementsAllowed.forEach((possiblePositionString: string) => {
      //Evaluate is a posible casteling
      if (
        (item.type == TypeOfPiece.KING || item.type == TypeOfPiece.ROOK) &&
        item.neverMoved &&
        evaluateCastling(board, item, possiblePositionString)
      ) {
        movementsAllowedFiltered.push(possiblePositionString);
      } else {
        if (notInCheck(board, item, possiblePositionString)) movementsAllowedFiltered.push(possiblePositionString);
      }
    });

    return movementsAllowedFiltered;
  } else return movementsAllowed;
};

const notInCheck = (board: Array<Array<PieceType | null>>, item: PieceType, possiblePositionString: string): boolean => {
  //clone the board to simulate the move
  let testBoard = JSON.parse(JSON.stringify(board));
  let testItem = JSON.parse(JSON.stringify(item));

  let possiblePosition = tPosSN(possiblePositionString);
  let currentPosition = tPosSN(item.key);
  testItem.key = possiblePositionString;

  testBoard[currentPosition.x][currentPosition.y] = null;
  testBoard[possiblePosition.x][possiblePosition.y] = item;
  testBoard = loadMovementsAllowed(testBoard, false);
  return !isItInCheck(testBoard, testItem.color);
};

/** evaluateCastling
 * if its a casteling and posiblePositionString put me in check return false
 */
const evaluateCastling = (board: Array<Array<PieceType | null>>, item: PieceType, possiblePositionString: string) => {
  let castelingEvaluated = false;
  let row = item.color === Color.WHITE ? 0 : 7;

  if (item.type == TypeOfPiece.KING) castelingEvaluated = notInCheckCastelingPerColor(board, item, possiblePositionString);
  //if the main item is a rook I evaluate the king position and posiblePositionString would be the rook position
  if (item.type == TypeOfPiece.ROOK) castelingEvaluated = notInCheckCastelingPerColor(board, board[row][4], item.key);

  return castelingEvaluated;
};

/** notInCheckCastelingPerColor
 * Evaluate if the king is in casteling and if movement possiblePositionString put me in check
 */
const notInCheckCastelingPerColor = (board: Array<Array<PieceType | null>>, itemKing: PieceType | null, possiblePositionString: string) => {
  let inCheck = false;

  if (itemKing !== null) {
    let row = itemKing.color === Color.WHITE ? 1 : 8;
    if (notInCheckCasteling(board, itemKing, possiblePositionString, `${row}e`, `${row}a`, `${row}c`)) inCheck = true;
    if (notInCheckCasteling(board, itemKing, possiblePositionString, `${row}e`, `${row}h`, `${row}g`)) inCheck = true;
  }

  return inCheck;
};

/** notInCheckCasteling
 * if possiblePositionString (where I will move the king) is 1a/8a/1h/8h is a casteling
 * I evaluate if the real movement put me on check
 * examples (1a ==> 1c, 1h ==>1g, 8a ==>8c, 8h ==>8g)
 */

const notInCheckCasteling = (
  board: Array<Array<PieceType | null>>,
  item: PieceType,
  possiblePositionString: string,
  kingPosition: string,
  fromPostition: string,
  toPostition: string
) => {
  if (item.key == kingPosition && possiblePositionString == fromPostition) return notInCheck(board, item, toPostition);
};

export default loadMovementsAllowedPerSquare;

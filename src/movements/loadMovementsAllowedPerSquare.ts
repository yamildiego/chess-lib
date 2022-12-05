import { PieceType, TypeOfPiece } from "../types";
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
      //clone the board to simulate the move
      let testBoard = JSON.parse(JSON.stringify(board));
      let testItem = JSON.parse(JSON.stringify(item));

      let possiblePosition = tPosSN(possiblePositionString);
      let currentPosition = tPosSN(item.key);
      testItem.key = possiblePositionString;

      testBoard[currentPosition.x][currentPosition.y] = null;
      testBoard[possiblePosition.x][possiblePosition.y] = item;
      testBoard = loadMovementsAllowed(testBoard, false);
      if (!isItInCheck(testBoard, testItem.color)) movementsAllowedFiltered.push(possiblePositionString);
    });

    return movementsAllowedFiltered;
  } else return movementsAllowed;
};

export default loadMovementsAllowedPerSquare;

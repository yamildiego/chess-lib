import { PieceType, Color } from "../types";
import getTheKingPosition from "./getTheKingPosition";

const isItInCheck = (board: Array<Array<PieceType | null>>, color: Color): boolean => {
  let king = getTheKingPosition(board, color);
  let x: number = 0;
  let isItInCheck: boolean = false;

  while (isItInCheck === false && x <= 7) {
    let y: number = 0;

    while (isItInCheck === false && y <= 7) {
      let item = board[x][y];
      if (item !== null && item.movementsAllowed.includes(king)) isItInCheck = true;
      y += 1;
    }
    x += 1;
  }

  return isItInCheck;
};

export default isItInCheck;

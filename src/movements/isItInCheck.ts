import { PieceType, Color } from "../types";
import getTheKingPosition from "./getTheKingPosition";

const isItInCheck = (board: Array<Array<PieceType | null>>, color: Color): boolean => {
  let king = getTheKingPosition(board, color);
  let x: number = 0;
  let isItInCheck: boolean = false;

  //I evalute the all board
  while (isItInCheck === false && x <= 7) {
    let y: number = 0;

    while (isItInCheck === false && y <= 7) {
      let item = board[x][y];
      //if some oponent's item can move where its my king, its in check
      if (item !== null && item.color != color && item.movementsAllowed.includes(king)) isItInCheck = true;
      y += 1;
    }
    x += 1;
  }

  return isItInCheck;
};

export default isItInCheck;

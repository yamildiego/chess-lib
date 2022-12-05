import { PieceType, TypeOfPiece, Color } from "../types";
import { tPosNS } from "../commonFunctions";

const getTheKingPosition = (board: Array<Array<PieceType | null>>, color: Color): string => {
  let king: string = "";
  let x: number = 0;

  while (king === "" && x <= 7) {
    let y: number = 0;
    while (king === "" && y <= 7) {
      let item: PieceType | null = board[x][y];
      if (item && item.color === color && item.type === TypeOfPiece.KING) king = tPosNS({ x, y });
      if (king === "") y += 1;
    }
    if (king === "") x += 1;
  }

  return king;
};

export default getTheKingPosition;

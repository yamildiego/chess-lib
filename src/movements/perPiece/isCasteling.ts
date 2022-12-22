import { tPosSN } from "../../commonFunctions";
import { PieceType, TypeOfPiece } from "../../types";

const isCasteling = (board: Array<Array<PieceType | null>>, kingPosition: string, rookPosition: string): boolean => {
  let isCasteling: boolean = false;

  let positionKing: { x: number; y: number } = tPosSN(kingPosition);
  let king: PieceType | null = board[positionKing.x][positionKing.y];

  let positionRook: { x: number; y: number } = tPosSN(rookPosition);
  let rook: PieceType | null = board[positionRook.x][positionRook.y];

  if (
    king !== null &&
    rook !== null &&
    king.type == TypeOfPiece.KING &&
    rook.type == TypeOfPiece.ROOK &&
    king.neverMoved &&
    rook.neverMoved
  ) {
    if (king.key === "1e") {
      if (rook.key === "1a" && board[0][1] == null && board[0][2] == null && board[0][3] == null) isCasteling = true;
      if (rook.key === "1h" && board[0][5] == null && board[0][6] == null) isCasteling = true;
    }

    if (king.key === "8e") {
      if (rook.key === "8a" && board[7][1] == null && board[7][2] == null && board[7][3] == null) isCasteling = true;
      if (rook.key === "8h" && board[7][5] == null && board[7][6] == null) isCasteling = true;
    }
  }

  return isCasteling;
};

export default isCasteling;

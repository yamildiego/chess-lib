import { PieceType, Color, TypeOfPiece } from "../../types";
import { tPosSN, tPosNS } from "../../commonFunctions";

const enPassantMovement = (board: Array<Array<PieceType | null>>, item: PieceType, history: Array<string>) => {
  let enPassantMovement: string | null = null;
  let position = tPosSN(item.key);

  if (history.length > 0) {
    let lastMovement = history[history.length - 1];
    let movements: Array<string> = lastMovement.toLowerCase().split("x");
    let positionFrom = tPosSN(movements[0]);
    let positionTo = tPosSN(movements[1]);
    let opponent = board[positionTo.x][positionTo.y];

    if (
      opponent !== null &&
      item.color !== opponent.color &&
      opponent.type == TypeOfPiece.PAWN &&
      (positionTo.y - 1 == position.y || positionTo.y + 1 == position.y)
    ) {
      if (item.color == Color.WHITE && positionFrom.x == 6 && positionTo.x == 4 && position.x == 4)
        enPassantMovement = tPosNS({ x: 5, y: positionTo.y });
      if (item.color == Color.BLACK && positionFrom.x == 1 && positionTo.x == 3 && position.x == 3)
        enPassantMovement = tPosNS({ x: 2, y: positionTo.y });
    }
  }
  return enPassantMovement;
};

export default enPassantMovement;

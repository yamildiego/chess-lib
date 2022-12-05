import { tPosNS } from "../../commonFunctions";
import { PieceType, Color } from "../../types";

const checkPosition = (board: Array<Array<PieceType | null>>, position: { x: number; y: number }, color: Color) =>
  (board[position.x] && board[position.x][position.y] === null) ||
  (board[position.x] &&
    board[position.x][position.y] &&
    board[position.x][position.y] !== null &&
    board[position.x][position.y]?.color !== color)
    ? tPosNS(position)
    : null;

export default checkPosition;

import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

import checkPosition from "./checkPosition";

const checkPositionPawn = (board: Array<Array<PieceType | null>>, position: { x: number; y: number }, color: Color) => {
  let test =
    (board[position.x] && board[position.x][position.y] !== null && board[position.x][position.y]?.color !== color) ||
    (board[position.x] &&
      board[position.x][position.y] &&
      board[position.x][position.y] !== undefined &&
      board[position.x][position.y] !== null &&
      board[position.x][position.y]?.color !== color)
      ? tPosNS(position)
      : null;

  return test;
};

const getPawnMovements = (board: Array<Array<PieceType | null>>, item: PieceType): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let position = tPosSN(item.key);
  let isWhite = item.color === Color.WHITE ? 1 : -1;

  // first square
  let facingPosition = { x: position.x + 1 * isWhite, y: position.y };
  let itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // left square
  facingPosition = { x: position.x + 1 * isWhite, y: position.y - 1 };
  itemFacing = checkPositionPawn(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // right square
  facingPosition = { x: position.x + 1 * isWhite, y: position.y + 1 };
  itemFacing = checkPositionPawn(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // FIRST MOVE
  if (item.neverMoved) {
    facingPosition = { x: position.x + 2 * isWhite, y: position.y };
    itemFacing = checkPosition(board, facingPosition, item.color);
    if (itemFacing !== null) movementsAllowed.push(itemFacing);
  }

  return movementsAllowed;
};

export default getPawnMovements;

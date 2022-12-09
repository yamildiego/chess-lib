import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

const checkPosition = (board: Array<Array<PieceType | null>>, position: { x: number; y: number }, color: Color) =>
  board[position.x] && board[position.x][position.y] === null ? tPosNS(position) : null;

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

  // FIRST MOVE
  if (item.neverMoved) {
    let facingPositionTwo = { x: position.x + 2 * isWhite, y: position.y };
    let itemFacingTwo = checkPosition(board, facingPositionTwo, item.color);
    if (itemFacing !== null && itemFacingTwo !== null) movementsAllowed.push(itemFacingTwo);
  }

  // left square
  if (position.y > 0) {
    facingPosition = { x: position.x + 1 * isWhite, y: position.y - 1 };
    itemFacing = checkPositionPawn(board, facingPosition, item.color);
    if (itemFacing !== null) movementsAllowed.push(itemFacing);
  }

  // right square
  if (position.y < 7) {
    facingPosition = { x: position.x + 1 * isWhite, y: position.y + 1 };
    itemFacing = checkPositionPawn(board, facingPosition, item.color);
    if (itemFacing !== null) movementsAllowed.push(itemFacing);
  }

  return movementsAllowed;
};

export default getPawnMovements;

import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

import checkPosition from "./checkPosition";

const getKingMovements = (board: Array<Array<PieceType | null>>, item: PieceType): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let position = tPosSN(item.key);
  let isWhite = item.color === Color.WHITE ? 1 : -1;

  // UP
  let facingPosition = { x: position.x + 1 * isWhite, y: position.y };
  let itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // DOWN
  facingPosition = { x: position.x - 1 * isWhite, y: position.y };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // LEFT
  facingPosition = { x: position.x, y: position.y - 1 * isWhite };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // RIGHT
  facingPosition = { x: position.x, y: position.y + 1 * isWhite };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // UPRIGHT
  facingPosition = { x: position.x + 1 * isWhite, y: position.y + 1 * isWhite };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // UPLEFT
  facingPosition = { x: position.x + 1 * isWhite, y: position.y - 1 * isWhite };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // DOWNPRIGHT
  facingPosition = { x: position.x - 1 * isWhite, y: position.y + 1 * isWhite };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  // DOWNLEFT
  facingPosition = { x: position.x - 1 * isWhite, y: position.y - 1 * isWhite };
  itemFacing = checkPosition(board, facingPosition, item.color);
  if (itemFacing !== null) movementsAllowed.push(itemFacing);

  return movementsAllowed;
};

export default getKingMovements;

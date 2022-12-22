import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color, TypeOfPiece } from "../../types";

import checkPosition from "./checkPosition";

import isCasteling from "./isCasteling";

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

  //CASTELING
  if (isCasteling(board, item.key, "1a")) movementsAllowed.push("1a");
  if (isCasteling(board, item.key, "1h")) movementsAllowed.push("1h");
  if (isCasteling(board, item.key, "8a")) movementsAllowed.push("8a");
  if (isCasteling(board, item.key, "8h")) movementsAllowed.push("8h");

  return movementsAllowed;
};

export default getKingMovements;

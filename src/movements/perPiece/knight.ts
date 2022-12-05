import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

import checkPosition from "./checkPosition";

const getKnightMovements = (board: Array<Array<PieceType | null>>, item: PieceType): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let position = tPosSN(item.key);
  let isWhite = item.color === Color.WHITE ? 1 : -1;

  // UPLEFT
  let squarePosition = { x: position.x + 2, y: position.y + 1 };
  let square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // UPRIGHT
  squarePosition = { x: position.x + 2, y: position.y - 1 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // DOWNLEFT
  squarePosition = { x: position.x - 2, y: position.y + 1 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // DOWNRIGHT
  squarePosition = { x: position.x - 2, y: position.y - 1 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // LEFTUP
  squarePosition = { x: position.x + 1, y: position.y + 2 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // LEFTDOWN
  squarePosition = { x: position.x - 1, y: position.y + 2 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // RIGHTUP
  squarePosition = { x: position.x + 1, y: position.y - 2 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  // RIGHTDOWN
  squarePosition = { x: position.x - 1, y: position.y - 2 };
  square = checkPosition(board, squarePosition, item.color);
  if (square !== null) movementsAllowed.push(square);

  return movementsAllowed;
};

export default getKnightMovements;

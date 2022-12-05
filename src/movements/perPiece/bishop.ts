import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

import checkPosition from "./checkPosition";

const getBishopMovements = (board: Array<Array<PieceType | null>>, item: PieceType): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let isWhite = item.color === Color.WHITE ? 1 : -1;

  let posString = null;

  //LEFTUP
  movementsAllowed = bishopCheckPosition(board, item, (position: { x: number; y: number }, leftUp: number) => ({
    x: position.x + leftUp * isWhite,
    y: position.y - leftUp * isWhite,
  })).concat(movementsAllowed);

  //RIGHTUP
  movementsAllowed = bishopCheckPosition(board, item, (position, rightUp) => ({
    x: position.x + rightUp * isWhite,
    y: position.y + rightUp * isWhite,
  })).concat(movementsAllowed);

  //RIGHTDOWN
  movementsAllowed = bishopCheckPosition(board, item, (position, rightDown) => ({
    x: position.x - rightDown * isWhite,
    y: position.y + rightDown * isWhite,
  })).concat(movementsAllowed);

  //LEFTDOWN
  movementsAllowed = bishopCheckPosition(board, item, (position, leftDown) => ({
    x: position.x - leftDown * isWhite,
    y: position.y - leftDown * isWhite,
  })).concat(movementsAllowed);

  return movementsAllowed;
};

const bishopCheckPosition = (
  board: Array<Array<PieceType | null>>,
  item: PieceType,
  getNextPosition: (position: { x: number; y: number }, leftUp: number) => { x: number; y: number }
): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let numberOfMovements = 1;
  let position = tPosSN(item.key);
  let posString = checkPosition(board, getNextPosition(position, numberOfMovements), item.color);

  while (posString !== null) {
    if (posString !== null) movementsAllowed.push(posString);
    let posN = tPosSN(posString);
    numberOfMovements += 1;
    if (board[posN.x][posN.y] !== null && board[posN.x][posN.y]?.color !== board[position.x][position.y]?.color) numberOfMovements += 7;
    posString = checkPosition(board, getNextPosition(position, numberOfMovements), item.color);
  }

  return movementsAllowed;
};

export default getBishopMovements;

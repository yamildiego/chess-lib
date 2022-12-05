import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

import checkPosition from "./checkPosition";

const getQueenMovements = (board: Array<Array<PieceType | null>>, item: PieceType): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let isWhite = item.color === Color.WHITE ? 1 : -1;

  let posString: string | null = null;

  //LEFT
  movementsAllowed = queenCheckPosition(board, item, (position: { x: number; y: number }, left: number) => ({
    x: position.x,
    y: position.y + left * isWhite,
  })).concat(movementsAllowed);

  //RIGHT
  movementsAllowed = queenCheckPosition(board, item, (position: { x: number; y: number }, right: number) => ({
    x: position.x,
    y: position.y - right * isWhite,
  })).concat(movementsAllowed);

  //UP
  movementsAllowed = queenCheckPosition(board, item, (position: { x: number; y: number }, up: number) => ({
    x: position.x + up * isWhite,
    y: position.y,
  })).concat(movementsAllowed);

  //DOWN
  movementsAllowed = queenCheckPosition(board, item, (position: { x: number; y: number }, down: number) => ({
    x: position.x - down * isWhite,
    y: position.y,
  })).concat(movementsAllowed);

  //LEFTUP
  movementsAllowed = queenCheckPosition(board, item, (position: { x: number; y: number }, leftUp: number) => ({
    x: position.x + leftUp * isWhite,
    y: position.y - leftUp * isWhite,
  })).concat(movementsAllowed);

  //RIGHTUP
  movementsAllowed = queenCheckPosition(board, item, (position, rightUp) => ({
    x: position.x + rightUp * isWhite,
    y: position.y + rightUp * isWhite,
  })).concat(movementsAllowed);

  //RIGHTDOWN
  movementsAllowed = queenCheckPosition(board, item, (position, rightDown) => ({
    x: position.x - rightDown * isWhite,
    y: position.y + rightDown * isWhite,
  })).concat(movementsAllowed);

  //LEFTDOWN
  movementsAllowed = queenCheckPosition(board, item, (position, leftDown) => ({
    x: position.x - leftDown * isWhite,
    y: position.y - leftDown * isWhite,
  })).concat(movementsAllowed);

  return movementsAllowed;
};

const queenCheckPosition = (
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

export default getQueenMovements;

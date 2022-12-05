import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color } from "../../types";

import checkPosition from "./checkPosition";

const getRookMovements = (board: Array<Array<PieceType | null>>, item: PieceType): Array<string> => {
  let movementsAllowed: Array<string> = [];
  let isWhite = item.color === Color.WHITE ? 1 : -1;

  let posString: string | null = null;

  //LEFT
  movementsAllowed = rookCheckPosition(board, item, (position: { x: number; y: number }, left: number) => ({
    x: position.x,
    y: position.y + left * isWhite,
  })).concat(movementsAllowed);

  //RIGHT
  movementsAllowed = rookCheckPosition(board, item, (position: { x: number; y: number }, right: number) => ({
    x: position.x,
    y: position.y - right * isWhite,
  })).concat(movementsAllowed);

  //UP
  movementsAllowed = rookCheckPosition(board, item, (position: { x: number; y: number }, up: number) => ({
    x: position.x + up * isWhite,
    y: position.y,
  })).concat(movementsAllowed);

  //DOWN
  movementsAllowed = rookCheckPosition(board, item, (position: { x: number; y: number }, down: number) => ({
    x: position.x - down * isWhite,
    y: position.y,
  })).concat(movementsAllowed);

  return movementsAllowed;
};

const rookCheckPosition = (
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

export default getRookMovements;

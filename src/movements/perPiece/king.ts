import { tPosSN, tPosNS } from "../../commonFunctions";

import { PieceType, Color, TypeOfPiece } from "../../types";

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

  //CASTELING
  if (item.key === "1e" && item.neverMoved) {
    let rookLeft = board[0][0];
    if (rookLeft !== null && rookLeft.type == TypeOfPiece.ROOK && rookLeft.neverMoved) {
      if (board[7][1] == null && board[7][2] == null && board[7][3] == null) movementsAllowed.push("1a");
    }

    let rookRight = board[0][7];
    if (rookRight !== null && rookRight.type == TypeOfPiece.ROOK && rookRight.neverMoved) {
      if (board[7][5] == null && board[7][6] == null) movementsAllowed.push("1h");
    }
  }

  if (item.key === "8e" && item.neverMoved) {
    let rookRight = board[7][0];
    if (rookRight !== null && rookRight.type == TypeOfPiece.ROOK && rookRight.neverMoved) {
      if (board[7][1] == null && board[7][2] == null && board[7][3] == null) movementsAllowed.push("8a");
    }

    let rookLeft = board[7][7];
    if (rookLeft !== null && rookLeft.type == TypeOfPiece.ROOK && rookLeft.neverMoved) {
      if (board[7][5] == null && board[7][6] == null) movementsAllowed.push("8h");
    }
  }

  return movementsAllowed;
};

export default getKingMovements;

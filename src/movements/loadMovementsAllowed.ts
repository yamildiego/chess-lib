import { PieceType, TypeOfPiece } from "../types";
import loadMovementsAllowedPerSquare from "./loadMovementsAllowedPerSquare";

const loadMovementsAllowed = (oldBoard: Array<Array<PieceType | null>>, isFirstRun: boolean) => {
  let board: Array<Array<PieceType | null>> = [];
  oldBoard.forEach((row: Array<PieceType | null>, indexRow: number) => {
    let newRow: Array<PieceType | null> = [];
    row.forEach((square: PieceType | null, indexSquare: number) => {
      if (square !== null) {
        square.movementsAllowed = loadMovementsAllowedPerSquare(oldBoard, square, isFirstRun);
      }
      newRow.push(square);
    });
    board.push(newRow);
  });

  return board;
};

export default loadMovementsAllowed;

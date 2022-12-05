type ChessType = {
  getBoardInText: () => string;
  getMovements: (position: string) => Array<string>;
  move: (movement: string) => boolean;
};

enum TypeOfPiece {
  PAWN = "P",
  BISHOP = "B",
  KNIGHT = "N",
  ROOK = "R",
  QUEEN = "Q",
  KING = "K",
}

enum Color {
  BLACK = "B",
  WHITE = "W",
}

type PieceType = {
  key: string;
  color: Color;
  type: TypeOfPiece;
  movementsAllowed: Array<string>;
  neverMoved: boolean;
};

export { ChessType, TypeOfPiece, PieceType, Color };

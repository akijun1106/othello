'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    if (board[y][x] !== 0) return;
    console.log(x, y);
    const newBoard = structuredClone(board);
    const directions = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    //flippedany=falseで初期化
    let flippedAny = false;

    for (const [dx, dy] of directions) {
      const toFlip: [number, number][] = [];
      let nx = x + dx;
      let ny = y + dy;
      //letは変数を定義するもの
      //constも同じだがletとは違い再定義ができない

      // まず相手の石が続く限り収集
      //whileの意味はtrueの間だけ繰り返す
      while (newBoard[ny]?.[nx] === 3 - turnColor) {
        toFlip.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
      // 「自分の石」で挟めていたらひっくり返し
      if (toFlip.length > 0 && newBoard[ny]?.[nx] === turnColor) {
        for (const [fx, fy] of toFlip) {
          newBoard[fy][fx] = turnColor;
        }
        flippedAny = true;
      }
    }

    // 一方向でも返せていれば合法手とみなす
    //flippedany=falseで初期化
    //八方向にチェックを入れて挟めていたらflippedany=trueとする
    if (flippedAny) {
      // 自分の石をクリックマスに置く
      newBoard[y][x] = turnColor;
      setBoard(newBoard);
      setTurnColor(3 - turnColor);
      if (board[y + 1] !== undefined && board[y + 1][x] === 3 - turnColor) {
        newBoard[y][x] = turnColor;
        setTurnColor(3 - turnColor);
      }
      if (board[y][x + 1] === 3 - turnColor) {
        newBoard[y][x] = turnColor;
        setTurnColor(3 - turnColor);
      }
      if (board[y][x - 1] === 3 - turnColor) {
        newBoard[y][x] = turnColor;
        setTurnColor(3 - turnColor);
      }
      if (board[y - 1] !== undefined && board[y - 1][x] === 3 - turnColor) {
        newBoard[y][x] = turnColor;
        setTurnColor(3 - turnColor);
      }
      setBoard(newBoard);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stone}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                  {...(board[x][y] === 0 && flippedany === false && <div className={styles.dot} />)}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

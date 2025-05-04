'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [turnColor, setTurnColor] = useState<1 | 2>(1);
  const [board, setBoard] = useState<number[][]>([
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
    // 空きマスでなければ何もしない
    if (board[y][x] !== 0) return;

    const me = turnColor; // 自分の色
    const opp = 3 - turnColor; // 相手の色
    const newBoard = structuredClone(board);

    // 8方向ベクトル
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

    let flippedAny = false;

    for (const [dx, dy] of directions) {
      const toFlip: [number, number][] = [];
      let nx = x + dx;
      let ny = y + dy;

      // 相手の石が続く限り収集
      while (newBoard[ny]?.[nx] === opp) {
        toFlip.push([nx, ny]);
        nx += dx;
        ny += dy;
      }

      // 最後に自分の石で挟めていたらひっくり返す
      if (toFlip.length > 0 && newBoard[ny]?.[nx] === me) {
        toFlip.forEach(([fx, fy]) => {
          newBoard[fy][fx] = me;
        });
        flippedAny = true;
      }
    }

    // ひとつでもひっくり返せていれば合法手
    if (flippedAny) {
      newBoard[y][x] = me;
      setBoard(newBoard);
      setTurnColor(opp);
    }
  }; // clickHandler 終了

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
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

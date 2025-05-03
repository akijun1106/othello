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

  // ── 1）そのマスに石が置けるかどうかを返す関数
  const canPlace = (x: number, y: number): boolean => {
    if (board[y][x] !== 0) return false; // 空きマスでなければダメ
    const me = turnColor;
    const opp = 3 - me;
    const dirs = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];

    for (const [dx, dy] of dirs) {
      let nx = x + dx,
        ny = y + dy;
      let cnt = 0;
      // 相手の石が続く限りカウント
      while (board[ny]?.[nx] === opp) {
        cnt++;
        nx += dx;
        ny += dy;
      }
      // 1個以上挟んで、その先が自分の石なら合格
      if (cnt > 0 && board[ny]?.[nx] === me) {
        return true;
      }
    }
    return false;
  };

  // ── 2）クリック処理でも canPlace を使って弾く
  const clickHandler = (x: number, y: number) => {
    if (!canPlace(x, y)) return;

    const me = turnColor;
    const opp = 3 - me;
    const newBoard = structuredClone(board);

    // 駒をひっくり返す処理
    const dirs = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];
    for (const [dx, dy] of dirs) {
      const toFlip: [number, number][] = [];
      let nx = x + dx,
        ny = y + dy;

      while (newBoard[ny]?.[nx] === opp) {
        toFlip.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
      if (toFlip.length > 0 && newBoard[ny]?.[nx] === me) {
        toFlip.forEach(([fx, fy]) => {
          newBoard[fy][fx] = me;
        });
      }
    }

    // 自分の石を置いて手番交代
    newBoard[y][x] = me;
    setBoard(newBoard);
    setTurnColor(opp);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => {
            const isLegal = canPlace(x, y);
            return (
              <div
                key={`${x}-${y}`}
                className={`${styles.cell} ${isLegal ? styles.legal : ''}`}
                onClick={() => clickHandler(x, y)}
              >
                {color !== 0 ? (
                  <div
                    className={styles.stone}
                    style={{ background: color === 1 ? '#000' : '#fff' }}
                  />
                ) : (
                  // 空きマスかつ合法手ならドットを表示
                  isLegal && <div className={styles.dot} />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

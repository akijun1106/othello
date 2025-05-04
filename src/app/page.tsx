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
    if (board[y][x] !== 0) return;
    const newBoard = structuredClone(board);
    const dirs = [
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
      [0, -1],
      [1, -1],
    ];
    let flipped = false;

    for (const [dx, dy] of dirs) {
      const toFlip: [number, number][] = [];
      let nx = x + dx,
        ny = y + dy;
      // 相手の石を集める
      while (newBoard[ny]?.[nx] === 3 - turnColor) {
        toFlip.push([nx, ny]);
        nx += dx;
        ny += dy;
      }
      // 自分の石でサンドできていれば裏返す
      if (toFlip.length > 0 && newBoard[ny]?.[nx] === turnColor) {
        toFlip.forEach(([fx, fy]) => {
          newBoard[fy][fx] = turnColor;
        });
        flipped = true;
      }
    }

    if (!flipped) return;

    newBoard[y][x] = turnColor;
    setBoard(newBoard);
    // 関数更新で 1 ⇄ 2 を切り替え
    setTurnColor((prev) => (prev === 1 ? 2 : 1));
  };

  return (
    <div className={styles.container}>
      {/* シンプルにテキスト表示 */}
      <p style={{ fontSize: 18, fontWeight: 'bold' }}>{turnColor === 1 ? '黒の番' : '白の番'}</p>

      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((c, x) => (
            <div key={`${x}-${y}`} className={styles.cell} onClick={() => clickHandler(x, y)}>
              {c !== 0 && (
                <div className={styles.stone} style={{ background: c === 1 ? '#000' : '#fff' }} />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

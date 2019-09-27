import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// class Square extends React.Component {
//   render() {
//     return (
//       /* 使用this.setState方法来修改state中的值 */
//       <button className="square" onClick={() => this.props.onClick()}>
//         {/* 使用this.props获取传入组件的参数 */}
//         {this.props.value}
//       </button>
//     );
//   }
// }

/* react中函数组件的写法，不需要render函数，直接返回jsx，参数传入props，props中的方法不要添加立即执行（添加()） */
function Square(props) {
  return (
    /* 事件绑定必须使用函数，使用this.setState方法来修改state中的值 */
    /* 这种事件绑定跟上面的事件绑定是一样的，对于有传参的方法就必须要用一个函数包着，不然就会立即执行。对于没有传参要求的方法，可以不用函数包着 */
    <button className="square" onClick={props.onClick}>
      {/* 使用this.props获取传入组件的参数 */}
      {props.value}
    </button>
  );
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)}/>;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      historys: [
        {
          squares: Array(9).fill(null)
        }
      ],
      historyStep: 0, // 当前历史的坐标
      isNextX: true,
      winner: null
    }
  }

  render() {
    const historys = this.state.historys;
    const current = historys[this.state.historyStep];

    const moves = historys.map((step, move) => {
      const desc = move ?
        'Move #' + move :
        'Game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status = null;
    if (this.state.winner) {
      status = 'winner: ' + this.state.winner;
    } else {
      status = "Next player: " + (this.state.isNextX ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handlerClick(i)}/>
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handlerClick(i) {
    // 浅拷贝state.squares数据用于存储修改后的数据
    const historys = this.state.historys.slice(0, this.state.historyStep + 1);
    // 最新的squares在数组的最后面
    const squares = historys[historys.length - 1].squares.slice();
    if (this.state.winner || squares[i]) {return;}
    console.log(i);
    squares[i] = this.state.isNextX ? 'X' : 'O';
    // 只能是用这种方式修改state中的数据
    this.setState({
      historys: historys.concat([{squares}]),
      isNextX: !this.state.isNextX,
      historyStep: historys.length
    });

    let winner = checkWin(i, squares);

    console.log('winner', winner);
    if (winner) {
      this.setState({
        winner
      });
    }
  }

  jumpTo(index) {
    console.log('jumpTo', index);
    // index是下标

    // 不需要处理数组了，靠historyStep就可以
    // let historys = this.state.historys.slice(0, index + 1);

    this.setState({
      isNextX: index % 2 === 0, // 因为 X 先走棋，所以历史长度为基数的时候就是 X 走的
      historyStep: index,
      winner: null
    });
  }
}

// 判断是否胜利
function checkWin(index, squares) {
  /**
   * 判断四个方向的符号是否相同
   */
  let checkedLine = [];
  let squareNum = 3; // 宫格数
  let row = Math.floor(index / squareNum); // 点击所在的行，从0开始
  let col = index % squareNum; // 点击所在的列，从0开始

  // 横方向，默认按照3宫格处理了
  checkedLine.push([row * squareNum, row * squareNum + 1, row * squareNum + 2]);
  // 列方向，默认按照3宫格处理了
  checkedLine.push([col, col + squareNum * 1, col + squareNum * 2]);

  // 对角方向，对角有两条线，一个是左上对右下（倍数：宫格数加1），一个是右上对左下（倍数：宫格数减一）
  if (index % 2 === 0) {
    // 默认按照3宫格处理了
    checkedLine.push([2, 4, 6]);
  }

  if (index % 4 === 0) {
    // 默认按照3宫格处理了
    checkedLine.push([0, 4, 8]);
  }

  console.log('checkedLine', checkedLine);

  for (let i = 0; i < checkedLine.length; i++) {
    const [a, b, c] = checkedLine[i];
    console.log(`${a}-${b}-${c}`, `${squares[a]}-${squares[b]}-${squares[c]}`);
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

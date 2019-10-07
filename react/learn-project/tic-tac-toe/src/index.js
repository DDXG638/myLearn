import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import AntdFormTest from './components/AntdFormTest';
import MyFormTest from "./components/MyFormTest";

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
    /* 这种事件绑定跟上面的事件绑定是一样的，对于有传参的方法就必须要用一个函数包着，
       不然就会立即执行。对于没有传参要求的方法，可以不用函数包着 
       还需要注意事件绑定中的this的指向，有三种写法，
       see：https://www.reactjscn.com/docs/handling-events.html
    */
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
          <Board squares={current.squares} onClick={this.handlerClick}/>
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  handlerClick = (i) => {
    console.log('handlerClick', i, this);
    // 浅拷贝state.squares数据用于存储修改后的数据
    const historys = this.state.historys.slice(0, this.state.historyStep + 1);
    // 最新的squares在数组的最后面
    const squares = historys[historys.length - 1].squares.slice();
    if (this.state.winner || squares[i]) {return;}
    console.log(i);
    squares[i] = this.state.isNextX ? 'X' : 'O';
    // 只能是用这种方式修改state中的数据
    // 需要注意的是this.setState是异步执行的，this.props 和 this.state 的更新也可能是异步更新的。
    // 所以你不应该依靠它们的值来计算下一个状态
    /* this.setState({
      historys: historys.concat([{squares}]),
      isNextX: !this.state.isNextX,
      historyStep: historys.length
    }); */

    console.log('beforeHistoryLength', this.state.historys.length);

    // 上面的代码最好替换成下面的形式
    this.setState((prevState, props) => ({
      historys: historys.concat([{squares}]),
      isNextX: !prevState.isNextX,
      historyStep: historys.length
    }), () => {
      console.log('afterHistoryLength', this.state.historys.length);
    });

    // 因为this.setState方法是异步的的，所以下面的输出是没有变化的，可以在this.setState方法中添加一个回调函数来解决
    // console.log('afterHistoryLength', this.state.historys.length);

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

// ReactDOM.render(<Game />, document.getElementById("root"));

// 渲染antd的组件
// ReactDOM.render(<AntdFormTest/>, document.getElementById("root"));

// 渲染自己封装的组件
ReactDOM.render(<MyFormTest/>, document.getElementById("root"));

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const classes = props.winner ? 'square active': 'square';
  return (
    <button className={classes} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i, row_index) {
    const hasWinner = (this.props.winner && this.props.winner.solution.includes(i)) ? true: false;
    const coord = row_index + "/" + i;

    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} key={i} winner={hasWinner} coord={coord} />;
  }

  render() {
    return (
      <div>
        {this.props.coords.map((row, row_index) =>
          <div className="board-row" key={row_index}>
            {row.map((col) =>
              this.renderSquare(col, row_index)
            )}
          </div>
        )}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        coordIndex: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      sortAscending: true,
    };

    this.coords = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = (this.state.xIsNext) ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        coordIndex: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  flipSort(direction) {
    this.setState({
      sortAscending: direction === 'desc'? false: true
    });
  }

  getCoordsFromIndex(coordIndex) {
    let newCoords = ''
    this.coords.forEach((value, index) => {
      if(value.includes(coordIndex)) {
        newCoords = (index + 1) + '/' + (value.indexOf(coordIndex) + 1);
      }
    });
    return newCoords;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const coordIndex = step.coordIndex;
      const desc = move ?
        'Go to move #' + move + ' (' + this.getCoordsFromIndex(coordIndex) + ')':
        'Go to game start';
      
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={step.squares === current.squares ? 'active': ''}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner.player;
    } else {
      if(history.length <= 9) {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      } else {
        status = 'No winner after ' + history.length + ' steps!';
      }
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} coords={this.coords} onClick={(i) => this.handleClick(i)} winner={winner} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div className={this.state.sortAscending? 'game-history': 'game-history reverse'}>
            <div className="sort-handler">
              <span className="caption">Sorting:</span>
              <span className="sort sort-up" onClick={() => this.flipSort('asc')}>up</span>
              <span className="separator">|</span>
              <span className="sort sort-down" onClick={() => this.flipSort('desc')}>down</span>
            </div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        solution: lines[i],
        player: squares[a],
      }
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

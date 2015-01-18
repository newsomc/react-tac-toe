var React = require('react');
var _     = require('underscore');

var Game = (function() {
  
  Game.prototype.isX = true;
  
  Game.prototype.playerX = 0;
  
  Game.prototype.playerO = 0;

  Game.prototype.moves = 0;

  Game.prototype.winner = null;

  Game.prototype.field = null;

  Game.prototype.winningNumbers = [7, 56, 448, 73, 146, 292, 273, 84];

  function Game() {
    var x;
    this.fields = (function() {
      var i, results = [];
      for (x = i = 0; i <= 8; x = ++i) {
        results.push(Math.pow(2, x));
      }
      return results;
    })();
  }

  Game.prototype.currentSymbol = function() {
    return this.isX === true ? 'x' : 'o';
  };

  Game.prototype.currentPlayer = function() {
    return this.isX === true ? this.playerX : this.playerO;
  };

  Game.prototype.checkWinner = function() {
    var number, i, len, ref = this.winningNumbers;
    
    for (i = 0, len = ref.length; i < len; i++) {
      number = ref[i];
      if ((number & this.currentPlayer()) === number ) {
        this.winner = "Player " + (this.currentSymbol().toUpperCase());
      }
    }

    if (this.moves > 8) {
      return this.winner = 'Nobody';
    }
    
    return this.winner;
    
  };

  Game.prototype.updateCurrentSymbol = function() {
    return this.isX = !this.isX;
  };

  Game.prototype.updateGameState = function( index ) {
    
    if ( this.isX ) {
      this.playerX += this.fields[index];
    }
    else {
      this.playerO += this.fields[index];
    }
    
    this.moves++;
    
    this.checkWinner();
    
    return this.updateCurrentSymbol();
  };

  Game.prototype.reset = function() {
    this.isX = true;
    this.playerX = 0;
    this.playerO = 0;
    this.moves = 0;
    return this.winner = null;
  };

  return Game;
  
})();


game = new Game;

var BoardCell = React.createClass({
  
  getInitialState: function() {
    return {
      symbol: null
    };
  },
  componentWillReceiveProps: function() {
    if (!this.props.gameInProgress) {
      return this.setState({
        symbol: null
      });
    }
    return null;
  },
  classes: function() {
    return ['board-cell', this.state.symbol ? "" + this.state.symbol + "Symbol" : void 0].join(' ');
  },
  render: function() {
    return React.createElement('div', {
      className: this.classes(),
      onMouseUp: this.clickHandler
    });
  },
  clickHandler: function() {
    if (!this.state.symbol) {
      this.setState({
        symbol: game.currentSymbol()
      });
      game.updateGameState(this.props.index);
      return this.props.onClick();
    }
  }
});


var GameBoard = React.createClass({
  render: function() {
    return React.createElement('div', {
      className: 'game-board',
      children: (function() {
        var i, cells = [];
        for (i = 0; i <= 8; i++) {
          cells.push(
            BoardCell({
              index: i,
              onClick: this.props.onClick
            })
          );
        }
        return cells;
      }).call(this)
    });
  }
});


var GameModal = React.createClass({
  getClass: function(){
    return ['game-end-modal', this.props.gameInProgress ? "hidden" : void 0].join(' ');
  },
  
  render: function() {
    return React.createElement('div', {
      className: this.classes(),
      children: [
        NewGame({
          onClick: this.props.onNewGame
        }),
        DialogBox({
          winner: game.winner
        })
      ]
    });
  },
  classes: function() {
    return this.getClass();
  }
});


var DialogBox = React.createClass({
  winner: function() {
    return this.props.winner ? "" + this.props.winner + " wins" : void 0;
  },
  render: function() {
    return React.createElement('h1', {
      className: 'dialog-box',
      children: this.winner()
    });
  }
});


var NewGame = React.createClass({
  render: function() {
    return React.createElement('div', {
      className: 'new-game',
      children: 'New game',
      onMouseUp: this.props.onClick
    });
  }
});


var GameView = React.createClass({
  
  getInitialState: function() {
    return {
      gameInProgress: false
    };
  },
  
  render: function() {
    return React.createElement('div', {
      className: 'game-view',
      children: [
        GameBoard({
          onClick: this.onCellClick,
          gameInProgress: this.state.gameInProgress
        }),
        GameModal({
          onNewGame: this.onNewGame,
          gameInProgress: this.state.gameInProgress
        })
      ]
    });
  },
  
  onNewGame: function() {
    game.reset();
    return this.setState({
      gameInProgress: true
    });
  },
  
  onCellClick: function() {
    if (game.winner) {
      
      return this.setState({
        gameInProgress: false
      });
    }
    return null;
  }
});

module.exports = GameView;

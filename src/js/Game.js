/**
 * ----------------------------------------
 * file: Game.js
 * author: Clint Newsom
 * title:  Tic-Tac-Toe 
 * date: Jan 2014
 * ----------------------------------------
 */

var React = require('react');
var _     = require('underscore');

/**
 * Creates an object representing the 
 * complete game state, for use within our 
 * React classes. This kind of data managment could be 
 * replaced by using the Flux framework.
 *
 * http://facebook.github.io/flux/docs/todo-list.html
 * 
 * @class Game
 * 
 */

var Game = (function() {
  
  Game.prototype.playedByX = true;
  
  Game.prototype.playerX = 0;
  
  Game.prototype.playerO = 0;

  Game.prototype.totalMoves = 0;

  Game.prototype.winner = null;

  Game.prototype.fields = null;

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
    return this.playedByX === true ? 'x' : 'o';
  };

  Game.prototype.currentPlayer = function() {
    return this.playedByX === true ? this.playerX : this.playerO;
  };

  Game.prototype.checkWinner = function() {
    var number, i, len, ref = this.winningNumbers;
    
    for (i = 0, len = ref.length; i < len; i++) {
      number = ref[i];
      if ((number & this.currentPlayer()) === number ) {
        this.winner = "Player " + (this.currentSymbol().toUpperCase());
      }
    }

    if (this.totalMoves > 8) {
      return this.winner = 'Nobody';
    }
    
    return this.winner;
    
  };

  Game.prototype.updateCurrentSymbol = function() {
    return this.playedByX = !this.playedByX;
  };

  Game.prototype.updateGameState = function( index ) {
    
    if ( this.playedByX ) {
      this.playerX += this.fields[index];
    }
    else {
      this.playerO += this.fields[index];
    }
    
    this.totalMoves++;
    
    this.checkWinner();
    
    return this.updateCurrentSymbol();
  };

  Game.prototype.reset = function() {
    this.playedByX = true;
    this.playerX = 0;
    this.playerO = 0;
    this.totalMoves = 0;
    return this.winner = null;
  };

  return Game;
  
})();

// Instantiate our new Game object.
game = new Game;

/**
 * Represents a single board cell.
 * 
 * @ReactDOMComponent BoardCell 
 * 
 */
var BoardCell = React.createClass({
  // On set up, we do not have a player
  // player registered on the board.
  getInitialState: function() {
    return {
      symbol: null
    };
  },
  // If we see the game is no longer in progress,
  // make sure we are not setting a symbol. The game has
  // been drawn or won.
  componentWillReceiveProps: function() {
    if (!this.props.gameInProgress) {
      return this.setState({
        symbol: null
      });
    }
    return null;
  },
  // The magic we need to actually print an X or O in the cell.
  // the details of this are handled in the CSS, lines 88-120.
  // We simply prepend an X or O to a string to inject
  // correct class name. 
  classes: function() {
    return ['board-cell', this.state.symbol ? "" + this.state.symbol + "Symbol" : void 0].join(' ');
  },
  
  // Render this component. In react,
  // all components must implement a render method.
  // Here we create a div in React's virtual DOM
  // and pass it the appropriate events and class names.
  render: function() {
    return React.createElement('div', {
      className: this.classes(),
      onMouseUp: this.clickHandler
    });
  },
  // Get the current symbol on click, 
  // update the game state.
  clickHandler: function() {
    if (!this.state.symbol) {
      this.setState({
        symbol: game.currentSymbol()
      });
      game.updateGameState(this.props.index);
      return this.props.onClick();
    }
    return null;
  }
});


/**
 * Represents the entire game board. 
 *
 * @ReactDOMComponent `GameBoard`
 * 
 */
var GameBoard = React.createClass({
  // Since the BoardCell encapsulates all our logic
  // The only thing to do here is print them out in a div.
  // We create the div with React's `createElement` then
  // use it's children mehod to inject 9 board
  // cells (indexed at 0, thus <= 8).
  
  // We create a closure, then use call to pass in the
  // correct context, which is the ReactDOMComponent. 
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


/**
 * A container div
 *
 * @ReactDOMComponent `GameModal`
 * 
 */
var GameModal = React.createClass({
  // A helper to render the appropriate class depending
  // on whether the game is in progress, or ended.
  getClass: function(){
    return ['game-end-modal', this.props.gameInProgress ? "hidden" : void 0].join(' ');
  },
  // Inject two components:
  // 1] `NewGame`: which will contain a button triggering a new game.
  // 2] `DialogBox`: Simple H1 tag for flashing messages
  //     before and after a game.
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


/**
 * An H1 to flash messages in.
 *
 * @ReactDOMComponent `Dialogbox`
 * 
 */
var DialogBox = React.createClass({
  // Flash the winner messsage
  // when a game is complete.
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


/**
 * Container for a new game button.
 *
 * @ReactDOMComponent `New Game`
 * 
 */
var NewGame = React.createClass({
  render: function() {
    return React.createElement('div', {
      className: 'new-game',
      children: 'New game',
      onMouseUp: this.props.onClick
    });
  }
});


/**
 * Container for the game view.
 *
 * @ReactDOMComponent `GameView`
 * 
 */
var GameView = React.createClass({
  // When setting up the game, we have no game in
  // progress, I hope!! :-)
  getInitialState: function() {
    return {
      gameInProgress: false
    };
  },
  // Event for starting a new game.
  // We gick everything off by setting
  // `gameInProgress` to true.
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
  },
  // Render the entire game
  // with approriate events.
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
  }
});

module.exports = GameView;

var React = require('react');
var GameView = React.createFactory(require('./Game'));

document.addEventListener('DOMContentLoaded', function() {
  return React.render(GameView(), document.getElementById('game-view'));
});


import GameState from 'states/GameState';
import Firebase from 'Firebase';

class Game extends Phaser.Game {

	constructor() {
		super(500, 500, Phaser.AUTO, 'content', null);
		this.state.add('GameState', GameState, false);
		this.state.start('GameState');

		var player;
		var cursors;
		var userId = Date.now().toString();
		var fireRef = new Firebase('https://findplayer.firebaseio.com/');
		var enemies = {};
		console.log(fireRef);
	}

}

new Game(); 
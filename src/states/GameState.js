import RainbowText from 'objects/RainbowText';

class GameState extends Phaser.State {

    preload() {
        this.game.load.image('background','assets/tests/debug-grid-1920x1920.png');
        let dudeData = ['.......3.....','......333....','....5343335..','...332333333.','..33333333333','..37773337773','..38587778583','..38588888583','..37888888873','...333333333.','.F....5556...','3E34.6757.6..','.E.55.666.5..','......777.5..','.....6..7....','.....7..7....'];
        this.game.create.texture('player', dudeData, 4, 4, 0);
    }

    constructor() {
        super() {
            const player;
        }
    }

 	create() {
        // Starting variables
        //let player;
        let cursors;
        //let userId = Date.now().toString();
        let fireRef = new Firebase('https://findplayer.firebaseio.com/');
        //let enemies = {};
        console.log(fireRef);

        this.game.add.tileSprite(0, 0, 1920, 1920, 'background');
        this.game.world.setBounds(0, 0, 1920, 1920);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        player = this.game.add.sprite(this.game.world.centerX-100, this.game.world.centerY, 'player');
        player.anchor.setTo(0.5);
        this.game.physics.p2.enable(player);
        cursors = this.game.input.keyboard.createCursorKeys();
        this.game.camera.follow(player);

		let center = { x: this.game.world.centerX, y: this.game.world.centerY }
		let text = new RainbowText(this.game, center.x, center.y, "- phaser -\real time game with Firebase and ES6");
		text.anchor.set(0.5);
	}

    render() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        this.game.debug.spriteCoords(this.player, 32, 200);
        //fireRef.child(userId).set(player.position);
    }

}

export default GameState;

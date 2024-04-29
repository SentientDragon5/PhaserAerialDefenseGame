class Lose extends Phaser.Scene {
    
    constructor(){
        super("Lose");

    }

    preload() {
        this.load.setPath("./assets/kenney_pixel-shmup");
        this.load.image("player", "Ships/ship_0011.png");
    }

    create() {
        my.sprite.player = this.add.sprite(canvas_x/2, canvas_y/2 - 50, "player");
        my.sprite.player.scale = 4;
        var style = { font: "32px Verdana", fill: "#ffffff", align: "center" };
        var mainLabel = this.add.text(canvas_x/2 - 110, canvas_y/2, "You Lose...", style);

        style = { font: "24px Verdana", fill: "#ffffff", align: "center" };
        var score_text = this.add.text(canvas_x/2 - 110, canvas_y/2 + 50, "Score: " + score, style);
        
        style = { font: "16px Verdana", fill: "#ffffff", align: "center" };
        var message = this.add.text(canvas_x/2 - 90, canvas_y - 60, "press SPACE to restart", style);

        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', (event) => { this.scene.start('Game'); })
        var restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        restartKey.on('down', (event) => { this.scene.start('Game'); })
    }

    update() {

    }
}
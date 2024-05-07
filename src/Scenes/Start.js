class Start extends Phaser.Scene {
    
    constructor(){
        super("Start");

    }

    preload() {
        this.load.setPath("./assets/kenney_pixel-shmup");
        this.load.image("player", "Ships/ship_0011.png");
    }

    create() {
        my.sprite.player = this.add.sprite(canvas_x/2, canvas_y/2 - 50, "player");
        my.sprite.player.scale = 4;
        var style = { font: "32px Verdana", fill: "#ffffff", align: "center" };
        var mainLabel = this.add.text(canvas_x/2 - 110, canvas_y/2, "Aerial Defense", style);

        
        hiScore = parseInt(localStorage.getItem('hiScore')) || 0;
        style = { font: "24px Verdana", fill: "#ffffff", align: "center" };
        var high_score_text = this.add.text(canvas_x/2 - 110, canvas_y/2 + 80, "High Score: " + hiScore, style);

        style = { font: "16px Verdana", fill: "#ffffff", align: "center" };
        var message = this.add.text(canvas_x/2 - 90, canvas_y - 60, "press SPACE to begin", style);

        var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceBar.on('down', (event) => { this.scene.start('Game'); })
    }

    update() {

    }
}
class Game extends Phaser.Scene {
    
    constructor(){
        super("Game");
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("player", "kenney_pixel-shmup/Ships/ship_0011.png");
        this.load.image("bullet", "kenney_pixel-shmup/Tiles/tile_0000.png");
        this.load.image("explosion", "kenney_pixel-shmup/Tiles/tile_0004.png");
        this.load.image("heart", "simpleheart.png");
        this.load.image("enemy_green", "kenney_pixel-shmup/Ships/ship_0006.png");
        this.load.image("enemy_red", "kenney_pixel-shmup/Ships/ship_0009.png");
        this.load.image("enemy_blue", "kenney_pixel-shmup/Ships/ship_0004.png");

        
    }

    create() {

        this.px = canvas_x/2;
        this.py = canvas_y/2;
        this.moveSpeed = 5;
        this.bulletSpeed = 5;
        this.bullets = [];
        this.cooldown = 0;

        this.hearts = [];
        this.lives = 3;

        score  =0;
        // this.enemy_count_green_text;
        // this.enemy_count_red_text;
        // this.enemy_count_blue_text;
        
        // this.enemy_count_green = 4;
        // this.enemy_count_red = 2;
        // this.enemy_count_blue = 1;

        

        this.enemy_counts = {
            "enemy_green" : 0,
            "enemy_red" : 0,
            "enemy_blue" : 0
        }
        
        this.enemy_scores = {
            "enemy_green" : 10,
            "enemy_red" : 15,
            "enemy_blue" : 25
        }

        this.hitCooldown = 0;
        this.inviciblity = 10;

        my.sprite.enemies = [];

        this.explosions = [];

        my.sprite.player = this.add.sprite(this.px, this.py, "player");
        my.sprite.player.scale = 2;
        
        this.hearts.push(this.add.sprite(20, 20, "heart"));
        this.hearts.push(this.add.sprite(40, 20, "heart"));
        this.hearts.push(this.add.sprite(60, 20, "heart"));


        // Enemy spawn
        this.create_enemy("enemy_green",0.5, 0, [
            20, 20,
            400, 400,
            300, 750
        ]);
        
        this.create_enemy("enemy_green",0.5, 0, [
            canvas_x, 500,
            0, 500
        ]);
        this.create_enemy("enemy_green",0.5, 50, [
            canvas_x, 200,
            0, 200
        ]);
        this.create_enemy("enemy_green",0.5, 200, [
            canvas_x, 100,
            0, 100
        ]);
        this.create_enemy("enemy_green",0.5, 100, [
            canvas_x, 400,
            0, 400
        ]);

        this.create_blue(15,0,3.14/2,0.1, 100, [
            200, 0,
            200, canvas_y
        ]);
        
        this.create_enemy("enemy_red",0.5, 100, [
            canvas_x, 400,
            canvas_x/2 - 100, canvas_y/2,
            0, 400
        ]);

        


        // UI
        this.style = { font: "16px Verdana", fill: "#ffffff", align: "center" };
        var controls = this.add.text(100, canvas_y - 30, "Press W or S to fly up and down, press A or D to shoot in either direction.", this.style);

        var enemy_count_green_text = this.add.text(10, 40, this.enemy_counts["enemy_green"].toString() + "     left", this.style);
        var enemy_indicator_green = this.add.sprite(35, 50, "enemy_green");
        var enemy_count_red_text = this.add.text(10, 70, this.enemy_counts["enemy_red"].toString() + "     left", this.style);
        var enemy_indicator_red = this.add.sprite(35, 80, "enemy_red");
        var enemy_count_blue_text = this.add.text(10, 100, this.enemy_counts["enemy_blue"].toString() + "     left", this.style);
        var enemy_indicator_blue = this.add.sprite(35, 110, "enemy_blue");

        this.enemy_counts_text = {
            "enemy_green" :  enemy_count_green_text,
            "enemy_red" :  enemy_count_red_text,
            "enemy_blue" :  enemy_count_blue_text
        };

        this.score_text = this.add.text(canvas_x - 150, 20, "Score: " + score, this.style);

        
        var restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        restartKey.on('down', (event) => { this.scene.start('Game'); })
    }

    dist(x1,y1,x2,y2){
        return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
    }
    total_dist(points){
        let t = 0;
        for (let i = 0; i < points.length-2; i+=2) {
            t += this.dist(points[i],points[i+1],points[i+2],points[i+3]);
        }
        return t;
    }

    check_win(){
        if(this.enemy_counts["enemy_green"] <= 0 &&
        this.enemy_counts["enemy_red"] <= 0 &&
        this.enemy_counts["enemy_blue"] <= 0){
            this.scene.start('Win'); 
        }
    }

    player_hit(){
        if(this.hitCooldown <= 0){
            console.log("Collide");
            score -= 50;
            
            this.score_text.text = "Score: " + score;
            if(this.lives > 1){
                this.hearts[this.lives-1].visible = false;
                this.lives -=1;
                this.create_explosion(my.sprite.player);
            }
            else{
                this.scene.start('Lose'); 
            }
            this.hitCooldown = this.inviciblity;
        }
    }

    update() {
        // Enemy logic
        let index = my.sprite.enemies.length-1;
        while (index >= 0) {
            let e = my.sprite.enemies[index];

            if(e.sprite_name == "enemy_blue"){
                if(e.counter<=0){
                    this.create_bullet(e.x,e.y,e.bullet_x,e.bullet_y,e.bullet_rot,"enemy");
                    e.counter += 10;
                }
                e.counter--;
            }
            
            if(this.dist(my.sprite.player.x,my.sprite.player.y,e.x,e.y) < 50){
                this.player_hit();
            }

            this.bullets.forEach(b => {
                if(this.dist(b.x,b.y,e.x,e.y) < 50){
                    if(b.owner == "player"){
                        this.enemy_counts[e.sprite_name]--;
                        this.enemy_counts_text[e.sprite_name].text = this.enemy_counts[e.sprite_name].toString() + "     left";
                        if(this.enemy_counts[e.sprite_name] <=0){
                            this.check_win();
                        }
                        score += this.enemy_scores[e.sprite_name];
                        this.score_text.text = "Score: " + score;
                        this.create_explosion(e);
                        e.visible = false;
                        my.sprite.enemies.splice(index, 1);
                    }
                }
            });
            index -= 1;
        }


        // Player
        this.bullets.forEach(b => {
            if(this.dist(b.x,b.y,my.sprite.player.x,my.sprite.player.y) < 50){
                if(b.owner == "enemy"){
                    this.player_hit();
                }
            }
        });

        if(this.hitCooldown > 0){
            this.hitCooldown -= 1;
        }
        my.sprite.player.visible = this.hitCooldown % 2 == 0;

        if(this.cooldown <= 0){
            if(this.input.keyboard.addKey('A').isDown || this.input.keyboard.addKey('J').isDown){
                this.create_bullet(my.sprite.player.x,my.sprite.player.y,-15,0,-3.14/2,"player");
                this.cooldown += 7;
            }
            else if(this.input.keyboard.addKey('D').isDown || this.input.keyboard.addKey('L').isDown){
                this.create_bullet(my.sprite.player.x, my.sprite.player.y,15,0,3.14/2,"player");
                this.cooldown += 7;
            }
        }
        else{
            this.cooldown -=1;
        }
            
        let dy = (this.input.keyboard.addKey('W').isDown ? -1 : 0
        + this.input.keyboard.addKey('S').isDown ? 1 : 0) * this.moveSpeed;

        my.sprite.player.y += dy;
        if(my.sprite.player.y > canvas_y-10) my.sprite.player.y = canvas_y-10;
        if(my.sprite.player.y < 10) my.sprite.player.y = 10;


        // Bullets
        index = this.bullets.length-1;
        while (index >= 0) {
            var g = this.bullets[index];
            g.x += g.vel_x;
            g.y += g.vel_y;

            let padding = 10;
            if(g.x < -padding || g.x > canvas_x + padding || g.y < -padding || g.y > canvas_y + padding){
                g.visible = false;
                this.bullets.splice(index, 1);
            }
            
            index --;
        }

        // Explosions
        index = this.explosions.length-1;
        while (index >= 0) {
            var g = this.explosions[index];

            g.counter --;
            if(g.counter <=0){
                g.visible = false;
                this.explosions.splice(index, 1);
            }

            index --;
        }
    }

    create_bullet(x,y, vel_x, vel_y, rot, owner){
        let s = this.add.sprite(x, y, "bullet");
        s.scale = 2;
        s.vel_x = vel_x;
        s.vel_y = vel_y;
        s.rotation = rot;
        s.owner = owner;
        this.bullets.push(s);
    }

    create_explosion(enemy){
        var g = this.add.sprite(enemy.x,enemy.y, "explosion");
        g.scale = 2;
        g.counter = 10;// explosion lifetime
        this.explosions.push(g);
    }
    
    create_blue(bullet_x, bullet_y,bullet_rot,vel, delay, points){
        var e = this.create_enemy("enemy_blue", vel, delay, points);
        e.counter = 30;
        e.bullet_x = bullet_x;
        e.bullet_y = bullet_y;
        e.bullet_rot = bullet_rot;
    }

    create_enemy(enemy_sprite, vel, delay, points){
        // var points = [
        //     20, 20,
        //     400, 400,
        //     300, 750
        // ];
        var curve = new Phaser.Curves.Spline(points);
        var enemy = this.add.follower(curve, 10, 10, enemy_sprite);
        enemy.scale = 2;

        enemy.sprite_name = enemy_sprite;
        enemy.x = curve.points[0].x;
        enemy.y = curve.points[0].y;
        enemy.visible = true;
        let dur = this.total_dist(points)/vel;
        let followConfig = {
            from: 0,
            to: 1,
            delay: delay,
            duration: dur,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true,
            rotateToPath: true,
            rotationOffset: 90
        }
        enemy.startFollow(followConfig);

        my.sprite.enemies.push(enemy);
        this.enemy_counts[enemy_sprite] += 1;
        return enemy;
    }
}
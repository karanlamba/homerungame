
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('field', './img/field_800_600.png');
    game.load.spritesheet('hitter', './img/swing_598_64.png', 99,64);
    game.load.spritesheet('pitcher', './img/pitch_286_46.png', 26,46);
    game.load.spritesheet('ball', './img/Ball_1280_256.png', 256,256);
    game.load.spritesheet('button', './img/button_sprite_sheet.png', 193, 71);

}

var ballSpeed = 0;
var ballDistance = 4;
var homeRunRange = 300;
var swings = 0;
var homeRuns = 0;
var scoreText;
var scoreTextLabel = ' Home Runs';

function create() {

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    game.add.sprite(0, 0, 'field');

    pitcher = game.add.sprite(380, game.world.height - 350, 'pitcher');
    pitcher.scale.set(2.5);
    pitcher.smoothed = false;
    anim_pitch = pitcher.animations.add('pitch');

    ball = game.add.sprite(370, game.world.height - 306, 'ball');
    ball.visible = false;
    ball.scale.set(.12);
    ball.smoothed = false;
    ball.animations.add('ball_pitch', [0, 1, 2, 3], 4, false);
    ball.animations.add('ball_hit', [3, 4, 5, 6], 4, false);

    // The player and its settings
    player = game.add.sprite(100, game.world.height - 300, 'hitter');
    player.scale.set(4);
    player.smoothed = false;
    anim_swing = player.animations.add('swing');

    //  The score
    Text = game.add.text(16, 16, 'Double Tap', { fontSize: '32px', fill: '#000' });
    scoreText = game.add.text(580, 16, homeRuns + scoreTextLabel, { fontSize: '32px', fill: '#000' });

    // going full screen with the function defined at line 32
    goFullScreen();

    //THE PITCHER THROWS THE BALL
    anim_pitch.play(5, false);
    //
    anim_pitch.onComplete.add(animBallPitch, this);
    //game.time.events.add(Phaser.Timer.SECOND * 1, animBallPitch, this);
    game.input.onTap.add(onTap, this);

}

function update() {

}

// function to scale up the game to full screen
function goFullScreen(){
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.updateLayout(true);
}

function animBallPitch() {
    ball.animations.play('ball_pitch');
    ball.visible = true;
    game.time.events.repeat(Phaser.Timer.SECOND * .25, 5, animBallPitch_down_right, this);
}

function animBallPitch_down_right() {
    ball.y += 40 + ballSpeed;
    ball.x += 10 + (ballSpeed / 2);
    ballSpeed += 10;
    ballDistance -= 1;
}

function animBallhit(){
    //CHANGE THIS CONDITION TO MAKE A HIT EASY OR HARD
    if (ballDistance <= 2 && ballDistance >= 0) {
        ball.animations.play('ball_hit');
        game.time.events.repeat(Phaser.Timer.SECOND * .1, 4, animBallhit_up_right, this);
        game.time.events.add(Phaser.Timer.SECOND * 1, result, this);
    } else {
        Text = game.add.text(game.world.centerX - 95, 70, 'You Missed!', { fontSize: '32px', fill: '#000' });
        showButton();
    }
}

function animBallhit_up_right() {
    ball.y -= 65 - ballSpeed;
    ball.x += 15 + ballSpeed;
    ballSpeed -= 20;
    ballDistance += 1;
}

function result() {
    if ( ball.y < 290) {
        Text = game.add.text(game.world.centerX - 85, 70, 'Home Run!', { fontSize: '32px', fill: '#000' });
        homeRuns++;
        updateScore();
    } else {
        Text = game.add.text(game.world.centerX - 190, 70, 'Sorry Not A Home Run :(', { fontSize: '32px', fill: '#000' });
    } 
    showButton();
}

function updateScore(){
    scoreText.text = homeRuns + scoreTextLabel;
}

function showButton(){
    button = game.add.button(game.world.centerX - 95, 200, 'button', reset, this, 1, 0, 2);
    button.onInputOver.add(buttonOver, this);
    button.onInputOut.add(buttonOut, this);
    button.onInputUp.add(buttonUp, this);
}

function buttonUp() {
    console.log('button up', arguments);
}

function buttonOver() {
    console.log('button over');
}

function buttonOut() {
    console.log('button out');
}

function reset() {
    ballSpeed = 0;
    ballDistance = 4;
    homeRunRange = 300;
    swings = 0;
    Text.visible= false;
    pitcher.frame = 0;
    ball.x = 370; 
    ball.y = game.world.height - 306;
    ball.frame = 0;
    ball.visible = false;
    player.frame = 0;
    button.visible = false;

    //THE PITCHER THROWS THE BALL
    anim_pitch.play(5, false);
}

function onTap(pointer, doubleTap) {
    if (doubleTap)
    {
        //  They double-tapped, so swing the bat
        if (swings == 0){
            anim_swing.play(10, false);
            swings += 1;
            game.time.events.add(Phaser.Timer.SECOND * .4, animBallhit, this);
        }
    }
}
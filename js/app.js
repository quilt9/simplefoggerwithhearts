/* HS
 * Collide with Heart = +1 live 
 * Collide with Bug = -1 live 
*/

// Game surface variables
var gameCol = 101; /* col value */
var gameRow = 83 /* row value */
var gameTopMargin = 50; /* top empty space */
var gameBottomMargin = 20; /* bottom empty space */
var gameWidth = gameCol * 5; /* col width multiply number of columns - 505 */
var gameHeight = gameRow * 6; /* col height multiply number of rows - 498 */
var charWidth = 52; /* player width */
var charHeight = 45; /* player height */

// Speed in pixels per second
var speedMin = 200;
var speedMax = 700; 

// Player reset position
var resetX = gameCol * 2; /* 202 */
var resetY = gameHeight-gameRow; /* 415 */

// Add margins to entities
var rightMargin = 83,
    leftMargin = 18,
    topMargin = 81,
    bottomMargin = 132;

// Player sprite variables
var boy_3 = 'images/char-boy.png';
var cat_girl_6 = 'images/char-cat-girl.png';
var horn_girl_9 = 'images/char-horn-girl.png';
var pink_girl_12 = 'images/char-pink-girl.png';
var princess_girl_15 = 'images/char-princess-girl.png';

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Return a random speed
function enemySpeed() {
    return (speedMin + Math.floor(Math.random() * speedMax));
};

// Add lives and check player status
function playerUpdateStatus() {
    //player.lives += 1;
        // Check number of lives remaining
        if(player.lives > 0 && player.lives <= 3) {
            player.sprite = boy_3;
        } else if (player.lives > 3 && player.lives <= 6) {
            player.sprite = cat_girl_6;
        } else if (player.lives > 6 && player.lives <= 9) {
            player.sprite = horn_girl_9;
        } else if (player.lives > 9 && player.lives <= 12) {
            player.sprite = pink_girl_12;
        } else if (player.lives > 12) {
            player.sprite = princess_girl_15;
        }
        // Set player back to beginning coordinates
        player.x = resetX;
        player.y = resetY;
}

/*
============================================================================
*/

// Create Parent/Super class - Entity
// Enemy and Player objects will inherit some of its 
// properties and methods
var Entity = function(x,y,img) {
    this.x = x;
    this.y = y;
    this.sprite = img;
};

Entity.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Enemies our player must avoid
/* HS */
// Create subclass Enemy
var Enemy = function(x,y,rightX,leftX,topY,bottomY) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Entity.call(this,x,y,'images/enemy-bug.png',rightX,leftX,topY,bottomY);
    this.speed = enemySpeed();
};
// Inherit all of the properties and methods of Entity
Enemy.prototype = Object.create(Entity.prototype);
// Set the Enemey prototype constructor
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    /* HS */    
    // Determine whether the enemy is inside or outside of the canvas
    if(this.x > gameWidth + gameCol){
        // Reset the x coordinate to start again
        this.x = 0 - gameCol;
        this.y = gameRow * getRandomInt(0,3) + 65;
        // Create a random speed 
        this.speed = enemySpeed();
        }
        this.x += this.speed * dt;  
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* HS */
// Create Player prototype 
var Player = function(x,y,rightX,leftX,topY,bottomY) {
    Entity.call(this,x,y,'images/char-boy.png',rightX,leftX,topY,bottomY);
    this.alive = true;
    this.lives = 3;
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

Player.prototype.handleInput = function(keyCode) {

    if(keyCode === "left" && this.x > 0 + charWidth) {
        this.x -= gameCol;
    } else if(keyCode === "up" && this.y > gameTopMargin) {
        this.y -= gameRow;
    } else if(keyCode === "right" && this.x < gameWidth - gameCol) {
        this.x += gameCol;
    } else if(keyCode === "down" && this.y < gameHeight - gameRow) {
        this.y += gameRow;
    }
};

Player.prototype.update = function(x,y) {
    // Check to see if player reaches the water
    if (this.y <= 10) {
        // Add 1 live
        this.lives += 1;
        // Reset player
        // Update player sprite if needed, based on lives remaining
        playerUpdateStatus();
    }
};

Player.prototype.renderStatus = function() {
    ctx.clearRect(0, 0 , 505 , 40);
    ctx.font = "36px Arial";
    ctx.textAlign = 'center';
    // Draw scores on the top left
    ctx.fillStyle="#282828";
    ctx.fillText(this.lives + " LIVES", ctx.canvas.width/2, 35);
    ctx.clearRect(0, 590, 505, 620);
    ctx.font = "16px Arial";
    ctx.textAlign = 'left';
    // Draw scores on the top left
    ctx.fillStyle="#282828";
    ctx.fillText("Get a Heart + 1 Live", 0, 625);
    ctx.textAlign = 'center';
    ctx.fillText("Wet Your Toe + 1 Live", gameWidth/2, 625);
    ctx.textAlign = 'right';
    ctx.fillText("Get Bugged - 1 Live", gameWidth, 625);

};

// Check collisions
Player.prototype.checkCollisions = function(allEnemies,heart) {

    // Check collisions with enemies
    allEnemies.forEach(function(enemy) {
        if (player.x < enemy.x + 60 &&
            player.x + 37 > enemy.x &&
            player.y < enemy.y + 25 &&
            player.y + 30 > enemy.y) {
            // Delete 1 live
            player.lives -= 1;
            // Reset player
            // Update player sprite if needed, based on lives remaining
            playerUpdateStatus();
        }
    });

    // Check collisions with heart
    if (player.x < heart.x + 60 &&
        player.x + 37 > heart.x &&
        player.y < heart.y + 25 &&
        player.y + 30 > heart.y) {

            // Add 1 live
            player.lives += 1;
            // Reset heart
            heart.taken = true;
            heart.update();
            // Reset player
            // Update player sprite if needed, based on lives remaining
            playerUpdateStatus();
    }
};


/* HS */
// Add Heart to game for player to capture to gain live

var Heart = function(x, y, rightX,leftX,topY,bottomY) {
    Entity.call(this, x, y, 'images/Heart.png',rightX,leftX,topY,bottomY);
    this.taken = false;
};
Heart.prototype = Object.create(Entity.prototype);
Heart.prototype.constructor = Heart;
Heart.prototype.update = function() {
    // Heart will reset after it's taken
    if(this.taken === true) {
        this.x = gameCol * getRandomInt(0, 5);
        this.y = gameRow * getRandomInt(0,3)+65;
        this.taken = false;
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/* HS */
var allEnemies = [];
// For each enemy
// Set x coordinate randomly
// Set y coordinate for each enemy incrementally based on row value
// Set speed to a base of 100 and add random number
for(var i = 0; i < 3; i++) {
    var x = Math.floor(Math.random() * 30);
    var y = gameRow * getRandomInt(0,3) + 65;
    allEnemies.push(new Enemy(x,y,rightMargin,leftMargin,topMargin,bottomMargin));
}

var player = new Player(resetX, gameHeight-gameRow,rightMargin,leftMargin,topMargin,bottomMargin);
var heart = new Heart(gameCol * getRandomInt(0,6), gameRow * getRandomInt(0,3)+65,rightMargin,leftMargin,topMargin,bottomMargin);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

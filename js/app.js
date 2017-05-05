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

// Update lives and player sprite after enemy collision and getting to the water
function playerUpdateStatus() {
        // Check number of lives remaining
        if(player.lives === 0) {
            gameOver();
        } else if (player.lives === 20) {
            youWin();
        } else if (player.lives > 0 && player.lives <= 3) {
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

// Update lives and player status after heart collection
function heartUpdateStatus() {
        // Check number of lives remaining
        if (player.lives > 0 && player.lives <= 3) {
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
        //player.x = resetX;
        //player.y = resetY;
}

// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    player.alive = true;
    gameReset();
}

// Game Reset
function gameReset() {
    document.getElementById('play-again').addEventListener('click', function() {
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        if (player.alive ===  true) {
            player.x = resetX;
            player.y = resetY;
            //player.sprite = boy_3;
            player.alive = true;
            player.lives = 3;
            heart.x = gameCol * getRandomInt(0, 5);
            heart.y = gameRow * getRandomInt(0,3)+65;
        }
    });

}

// You win
function youWin() {
    document.getElementById('you-win').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    //player.x = -9999;
    player.alive = true;
    playAgain();
}

// Game Reset
function playAgain() {
    document.getElementById('you-win').addEventListener('click', function() {
        document.getElementById('you-win').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        if (player.alive ===  true) {
            player.x = resetX;
            player.y = resetY;
            player.sprite = boy_3;
            player.alive = true;
            player.lives = 3;
            heart.x = gameCol * getRandomInt(0, 5);
            heart.y = gameRow * getRandomInt(0,3)+65;
        }
    });

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
var Enemy = function(x,y) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    Entity.call(this,x,y,'images/enemy-bug.png');
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
var Player = function(x,y) {
    Entity.call(this,x,y,'images/char-boy.png');
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

    // Checks to see if player is alive and reset position
    if(this.alive === false && this.lives === 0) {
        // Stop game. Lives is 0.
        this.x = -9999;
        this.lives = 0;
        heart.x = -9999;
        gameOver();        
    } else if (this.alive === false && this.lives === 20) {
        // Stop game. Lives is 20.
        this.x = -99999;
        this.lives = 20;
        heart.x = -9999;
        youWin();
    }
};

Player.prototype.renderStatus = function() {
    ctx.clearRect(0, 0 , 505 , 40);
    ctx.font = "36px Arial";
    ctx.textAlign = 'center';
    // Draw scores on the top left
    ctx.fillStyle="#FF8C00";
    ctx.fillText(this.lives + " LIVES", ctx.canvas.width/2, 35);
    ctx.clearRect(0, 590, 505, 620);
    ctx.font = "28px Arial";
    ctx.textAlign = 'center';
    // Draw scores on the top left
    ctx.fillStyle="#FF8C00";
    ctx.fillText("Collect 20 Lives and Win", ctx.canvas.width/2, 625);
    ctx.clearRect(0, 625, 505, 650);
    ctx.font = "16px Arial";
    ctx.textAlign = 'left';
    // Draw scores on the top left
    ctx.fillStyle="#282828";
    ctx.fillText("Get a Heart + 1 Live", 0, 660);
    ctx.textAlign = 'center';
    ctx.fillText("Wet Your Toe + 1 Live", gameWidth/2, 660);
    ctx.textAlign = 'right';
    ctx.fillText("Get Bugged - 1 Live", gameWidth, 660);

};

// Check collisions
Player.prototype.checkCollisions = function(allEnemies,heart) {

    // Check collisions with enemies
    allEnemies.forEach(function(enemy) {
        if (player.x < enemy.x + 60 &&
            player.x + 37 > enemy.x &&
            player.y < enemy.y + 25 &&
            player.y + 30 > enemy.y) {
            // Player loses
            player.lives -= 1;
            if (player.lives === 0) {
                player.alive = false;
            } else {
                playerUpdateStatus();
            }
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
            // Update player sprite if needed, based on lives remaining
            // Check if there are 20 lives
            if (player.lives === 20) {
                // Stop game with 20 lives
                player.alive = false;
            } else {
                heartUpdateStatus();
            }
    }
};


/* HS */
// Add Heart to game for player to capture to gain live

var Heart = function(x, y, rightX,leftX,topY,bottomY) {
    Entity.call(this, x, y, 'images/Heart.png');
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
    allEnemies.push(new Enemy(x,y));
}

var player = new Player(resetX, resetY);
var heart = new Heart(gameCol * getRandomInt(0,6), gameRow * getRandomInt(0,3)+65);


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

// Enemies our player must avoid
var Enemy = function(x,y,speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    /* HS */
    // Setup the coordinates
    this.x = x;
    this.y = y;
    // Create variable for the enemy speed
    this.speed = enemySpeed;

    // Create variable for the value of col (engine.js)
    // Using a variable and defining it
    // Help to understand the logic in constructing the functions
    // Allow easier time to make changes to the game
    this.width = 101;
    this.height = 83;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    /* HS */    
    // Determine whether the enemy is inside or outside of the canvas
    if(this.x <= 505 + this.width){
        this.x += this.speed * dt;
        } else {
            // Reset the x coordinate to start again
            this.x = -100;
            // Create a random speed 
            this.speed = this.enemySpeed();
        }

    // Check collisions
    var checkCollisions = function(player) {

        enemies.forEach(function(enemy){

            if (player.x < this.x + 60 &&
                player.x + 37 > this.x &&
                player.y < this.y + 25 &&
                30 + player.y > this.y) {

                player.x = 200;
                player.y = 420;
            }
        });
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* HS */
// Give each enemy a random speed
Enemy.prototype.enemySpeed = function() {
    return Math.floor(Math.random() * 400);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* HS */
// Create Player prototype 
var Player = function(x,y,speed) {
    // Same Enemy properties 
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.width = 101;
    this.height = 83;

    this.sprite = 'images/char-horn-girl.png';
};

Player.prototype.update = function() {
    // Set x coordinate
    if (this.x <= 0) {
        this.x = 0;
    } 
    if (this.x >= 505 - this.width) {
        this.x = 400;
        }
    // Set y coordinate
    if (this.y >= 440) {
        this.y = 420;
    }
    if (this.y <= -10) {
        // Set player back to beginning coordinate
        this.x = 200;
        this.y = 420;
    }    
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case 'left' :
            this.x -= this.speed + 50;
            break;
        case 'up' :
            this.y -= this.speed + 35;
            break;
        case 'right' :
            this.x += this.speed + 50;
            break;
        case 'down' :
            this.y += this.speed +35;
            break;
    }
}

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
    var enemyX = Math.floor(Math.random() * 30);
    var enemyY = 65 + 83 * i;
    var enemySpeed = 100 + Math.floor(Math.random() * 500);
    allEnemies.push(new Enemy(enemyX, enemyY, enemySpeed));
}

var player = new Player(200, 420, 50);


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

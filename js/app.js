/* HS */

// Return a random speed
function enemySpeed() {
    return (200 + Math.floor(Math.random() * 400));
};

// Create Parent/Super class - Entity
// Enemy and Player objects will inherit some of its 
// properties and methods
var Entity = function(x,y,img) {
    // Setup the coordinates
    this.x = x;
    this.y = y;
    this.width = 101;
    this.height = 83;
    this.sprite = img;
    this.speed = 50;
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
    if(this.x <= ctx.canvas.width + this.width){
        this.x += this.speed * dt;
        } else {
            // Reset the x coordinate to start again
            this.x = -100;
            // Create a random speed 
            this.speed = enemySpeed();
        }
    // Check collision
    if (player.x < this.x + 60 &&
        player.x + 37 > this.x &&
        player.y < this.y + 25 &&
        30 + player.y > this.y) {

        player.x = 200;
        player.y = 420;
    }
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* HS */
// Create Player prototype 
var Player = function(x,y) {
    Entity.call(this,x,y,'images/char-horn-girl.png');
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;
Player.prototype.update = function(x,y) {
    // Set x coordinate
    if (this.x <= 0) {
        this.x = 0;
    } 
    if (this.x >= ctx.canvas.width - this.width) {
        this.x = 400;
        }
    // Set y coordinate
    if (this.y >= 440) {
        this.y = 420;
    }
    if (this.y <= 0) {
        // Set player back to beginning coordinate
        this.x = 200;
        this.y = 420;
    }    
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
            this.y += this.speed + 35;
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
    var x = Math.floor(Math.random() * 30);
    var y = 65 + 83 * i;
    var speed = 200 + Math.floor(Math.random() * 400);
    allEnemies.push(new Enemy(x, y, speed));
}

var player = new Player(200, 420);


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

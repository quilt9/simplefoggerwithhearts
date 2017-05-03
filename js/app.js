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

// Player movement in pixel
var playerX = gameCol;
var playerY = gameRow;

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

// Returns true if compared actors intersect
function intersect(entity1, entity2) {
        return !(entity1.right < entity2.left ||
                entity1.left > entity2.right ||
                entity1.top > entity2.bottom ||
                entity1.bottom < entity2.top);
}

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
    // Setup the coordinates
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
Player.prototype.update = function(x,y) {
    // Set x coordinate
    if (this.x <= 0) {
        this.x = 0;
    } 
    if (this.x >= gameWidth - gameCol) {
        this.x = gameWidth - gameCol;
        }
    // Set y coordinate
    if (this.y >= resetY) {
        this.y = resetY;
    }
    // Check to see if player reaches the water
    if (this.y <= 10) {
        // Add 1 live
        this.lives += 1;
        /*
        // Check number of lives remaining
        if(this.lives > 0 && this.lives <= 3) {
            this.sprite = boy_3;
        } else if (this.lives > 3 && this.lives <= 6) {
            this.sprite = cat_girl_6;
        } else if (this.lives > 6 && this.lives <= 9) {
            this.sprite = horn_girl_9;
        } else if (this.lives > 9 && this.lives <= 12) {
            this.sprite = pink_girl_12;
        } else if (this.lives > 12) {
            this.sprite = princess_girl_15;
        }
        // Set player back to beginning coordinates
        this.x = resetX;
        this.y = resetY;
        */
        playerUpdateStatus();
    }
};

Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case 'left' :
            this.x -= playerX;
            break;
        case 'up' :
            this.y -= playerY;
            break;
        case 'right' :
            this.x += playerX;
            break;
        case 'down' :
            this.y += playerY;
            break;
    }
}

Player.prototype.renderStatus = function() {
    ctx.clearRect(0, 0 , 505 , 40);
    ctx.font = "20px Arial";
    ctx.textAlign = 'center';
    // Draw scores on the top left
    ctx.fillStyle="#282828";
    ctx.fillText(this.lives + " LIVES", ctx.canvas.width/2, 35);
}

/*
// Check collisions
Player.prototype.checkCollisions = function(allEnemies, heart) {
    
    var self = this;
    allEnemies.forEach(function(enemy) {
        if(intersect(enemy, this)){
           this.alive = false;
        }
    });
    
    if(intersect(heart, this)) {
        heart.taken = true;
        this.lives = this.lives + 1;
    }
};
*/

/* HS */
// Add Heart to game for player to capture to gain live

var Heart = function(x, y) {
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
    var speed = enemySpeed();
    allEnemies.push(new Enemy(x, y, speed));
}

var player = new Player(resetX, gameHeight-gameRow);
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

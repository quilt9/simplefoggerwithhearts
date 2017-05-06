/* HS
 * Collide with Heart = +1 live 
 * Cross to the other side = +1 live
 * Collide with Bug = -1 live
 * Stop game = 0 live
 * Stop game = 20 lives
 */


 /* Global variables and functions
============================================================================
*/

// Game surface variables
var GAME_COL = 101; /* col value */
var GAME_ROW = 83; /* row value */
var GAME_TOP_MARGIN = 50; /* top empty space */
var GAME_WIDTH = GAME_COL * 5; /* col width multiply number of columns - 505 */
var GAME_HEIGHT = GAME_ROW * 6; /* col height multiply number of rows - 498 */
var CHAR_WIDTH = 52; /* player width */

// Speed in pixels per second
var SPEED_MIN = 200;
var SPEED_MAX = 700;

// Player reset position
var RESET_X = GAME_COL * 2; /* 202 */
var RESET_Y = GAME_HEIGHT - GAME_ROW; /* 415 */

// Player sprite variables
var BOY_3 = 'images/char-boy.png';
var CAT_GIRL_6 = 'images/char-cat-girl.png';
var HORN_GIRL_9 = 'images/char-horn-girl.png';
var PINK_GIRL_12 = 'images/char-pink-girl.png';
var PRINCESS_GIRL_15 = 'images/char-princess-girl.png';

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  "use strict";
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Game over
function gameOver() {
  document.getElementById('game-over').style.display = 'block';
  document.getElementById('game-over-overlay').style.display = 'block';
  player.alive = true;
  gameReset();
}

// Game Reset - Game Over
function gameReset() {
  document.getElementById('play-again').addEventListener('click', function () {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    if (player.alive === true) {
      player.x = RESET_X;
      player.y = RESET_Y;
      player.alive = true;
      player.lives = 3;
      heart.x = GAME_COL * getRandomInt(0, 5);
      heart.y = GAME_ROW * getRandomInt(0, 3) + 65;
    }
  });
}

// You win 
function youWin() {
  document.getElementById('you-win').style.display = 'block';
  document.getElementById('game-over-overlay').style.display = 'block';
  player.alive = true;
  playAgain();
}

// Game Reset - You Win
function playAgain() {
  document.getElementById('you-win').addEventListener('click', function () {
    document.getElementById('you-win').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    if (player.alive === true) {
      player.x = RESET_X;
      player.y = RESET_Y;
      player.sprite = BOY_3;
      player.alive = true;
      player.lives = 3;
      heart.x = GAME_COL * getRandomInt(0, 5);
      heart.y = GAME_ROW * getRandomInt(0, 3) + 65;
    }
  });
}


/* Create Parent/Super class - Entity
============================================================================
*/ 

// Enemy and Player objects will inherit some of its 
// properties and methods
var Entity = function (x, y, img) {
  this.x = x;
  this.y = y;
  this.sprite = img;
};

Entity.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/* Create Enemy prototype – Enemies our player must avoid
============================================================================
*/ 

var Enemy = function (x, y) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  Entity.call(this, x, y, 'images/enemy-bug.png');
  this.speed = SPEED_MIN + Math.floor(Math.random() * SPEED_MAX);
};
// Inherit all of the properties and methods of Entity
Enemy.prototype = Object.create(Entity.prototype);
// Set the Enemey prototype constructor
Enemy.prototype.constructor = Enemy;
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  /* HS */
  // Determine whether the enemy is inside or outside of the canvas
  if (this.x > GAME_WIDTH + GAME_COL) {
    // Reset the x coordinate to start again
    this.x = 0 - GAME_COL;
    this.y = GAME_ROW * getRandomInt(0, 3) + 65;
  }
  this.x += this.speed * dt;
};


/* Create Player prototype – Player the user controls
============================================================================
*/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/* HS */
// Create Player prototype 
var Player = function (x, y) {
  Entity.call(this, x, y, 'images/char-boy.png');
  this.alive = true;
  this.lives = 3;
};

Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

// Control player movement
Player.prototype.handleInput = function (keyCode) {
  if (keyCode === "left" && this.x > 0 + CHAR_WIDTH) {
    this.x -= GAME_COL;
  } else if (keyCode === "up" && this.y > GAME_TOP_MARGIN) {
    this.y -= GAME_ROW;
  } else if (keyCode === "right" && this.x < GAME_WIDTH - GAME_COL) {
    this.x += GAME_COL;
  } else if (keyCode === "down" && this.y < GAME_HEIGHT - GAME_ROW) {
    this.y += GAME_ROW;
  }
};

// Update lives and player sprite after enemy collision and getting to the water
Player.prototype.playerUpdateStatus = function() {
  // Check number of lives remaining
  if (this.lives === 0) {
    gameOver();
  } else if (this.lives === 20) {
    youWin();
  } else if (this.lives > 0 && this.lives <= 3) {
    this.sprite = BOY_3;
  } else if (this.lives > 3 && this.lives <= 6) {
    this.sprite = CAT_GIRL_6;
  } else if (this.lives > 6 && this.lives <= 9) {
    this.sprite = HORN_GIRL_9;
  } else if (this.lives > 9 && this.lives <= 12) {
    this.sprite = PINK_GIRL_12;
  } else if (this.lives > 12) {
    this.sprite = PRINCESS_GIRL_15;
  }
  // Set this back to beginning coordinates
  this.x = RESET_X;
  this.y = RESET_Y;
};

// Update lives and player status after heart collection
Player.prototype.heartUpdateStatus = function() {
  // Check number of lives remaining
  if (player.lives > 0 && player.lives <= 3) {
    player.sprite = BOY_3;
  } else if (player.lives > 3 && player.lives <= 6) {
    player.sprite = CAT_GIRL_6;
  } else if (player.lives > 6 && player.lives <= 9) {
    player.sprite = HORN_GIRL_9;
  } else if (player.lives > 9 && player.lives <= 12) {
    player.sprite = PINK_GIRL_12;
  } else if (player.lives > 12) {
    player.sprite = PRINCESS_GIRL_15;
  }
};

// Check player's state and update lives and player sprite
Player.prototype.update = function (x, y) {
  // Check to see if player reaches the water
  if (this.y <= 10) {
    // Add 1 live
    this.lives += 1;
    // Reset player
    // Update player sprite if needed, based on lives remaining
    this.playerUpdateStatus();
  }

  // Checks to see if player is alive and reset position
  if (this.alive === false && this.lives === 0) {
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


/* Create Heart prototype – Capture to gain lives
============================================================================
*/

var Heart = function (x, y) {
  Entity.call(this, x, y, 'images/Heart.png');
  this.taken = false;
};
Heart.prototype = Object.create(Entity.prototype);
Heart.prototype.constructor = Heart;
Heart.prototype.update = function () {
  // Heart will reset after it's taken
  if (this.taken === true) {
    this.x = GAME_COL * getRandomInt(0, 5);
    this.y = GAME_ROW * getRandomInt(0, 3) + 65;
    this.taken = false;
  }
};


/* Create the canvas created dynamically for text display
============================================================================
*/

Player.prototype.renderStatus = function () {
  ctx.clearRect(0, 0, 505, 40);
  ctx.font = "36px Arial";
  ctx.textAlign = 'center';
  // Draw scores on the top left
  ctx.fillStyle = "#ff8c00";
  ctx.fillText(this.lives + " LIVES", ctx.canvas.width / 2, 35);
  ctx.clearRect(0, 590, 505, 620);
  ctx.font = "28px Arial";
  ctx.textAlign = 'center';
  // Draw scores on the top left
  ctx.fillStyle = "#ff8c00";
  ctx.fillText("Collect 20 Lives and Win", ctx.canvas.width / 2, 625);
  ctx.clearRect(0, 625, 505, 650);
  ctx.font = "16px Arial";
  ctx.textAlign = 'left';
  // Draw scores on the top left
  ctx.fillStyle = "#282828";
  ctx.fillText("Get a Heart + 1 Live", 0, 660);
  ctx.textAlign = 'center';
  ctx.fillText("Wet Your Toe + 1 Live", GAME_WIDTH / 2, 660);
  ctx.textAlign = 'right';
  ctx.fillText("Get Bugged - 1 Live", GAME_WIDTH, 660);
};


/* Check collisions
============================================================================
*/

Player.prototype.checkCollisions = function (allEnemies, heart) {
  // Check collisions with enemies
  allEnemies.forEach(function (enemy) {
    if (player.x < enemy.x + 60 &&
      player.x + 37 > enemy.x &&
      player.y < enemy.y + 25 &&
      player.y + 30 > enemy.y) {
      // Player loses
      player.lives -= 1;
      if (player.lives === 0) {
        player.alive = false;
      } else {
        player.playerUpdateStatus();
      }
    }
  });

  // Check collisions with heart
  if (this.x < heart.x + 60 &&
    this.x + 37 > heart.x &&
    this.y < heart.y + 25 &&
    this.y + 30 > heart.y) {
    // Add 1 live
    this.lives += 1;
    // Reset heart
    heart.taken = true;
    heart.update();
    // Update player sprite if needed, based on lives remaining
    // Check if there are 20 lives
    if (this.lives === 20) {
      // Stop game with 20 lives
      this.alive = false;
    } else {
      this.heartUpdateStatus();
    }
  }
};


/* Instantiate objects
============================================================================
*/
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/* HS */
var allEnemies = [];
// For each enemy
// Set x coordinate randomly
// Set y coordinate for each enemy incrementally based on row value
for (var i = 0; i < 3; i++) {
  var x = Math.floor(Math.random() * 30);
  var y = GAME_ROW * getRandomInt(0, 3) + 65;
  allEnemies.push(new Enemy(x, y));
}
var player = new Player(RESET_X, RESET_Y);
var heart = new Heart(GAME_COL * getRandomInt(0, 6), GAME_ROW * getRandomInt(0, 3) + 65);


/* Listen for keyup
============================================================================
*/
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
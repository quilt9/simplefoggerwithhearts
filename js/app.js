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

// Game state text display html elements
var GAME_OVERLAY = document.getElementById("game-over-overlay");
var LOSS_GAME = document.getElementsByClassName("game-over")[0];
var WIN_GAME = document.getElementsByClassName("you-win")[0];
var LOSS_BUTTON = document.getElementsByClassName("loss")[0];
var WIN_BUTTON = document.getElementsByClassName("play-again")[0];

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

// subClass will inherit from superClass
var inherit = function(subClass,superClass) {
   subClass.prototype = Object.create(superClass.prototype); // delegate to prototype
   subClass.prototype.constructor = subClass; // set constructor on prototype
};

// Returns a random integer between min (included) and max (excluded)
function getRandomInt(min, max) {
  "use strict";
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

// Start game to play again. Not a reset.
function playAgain() {
  if (player.alive === true) {
      player.x = RESET_X;
      player.y = RESET_Y;
      player.sprite = BOY_3;
      player.lives = 3;
      heart.x = GAME_COL * getRandomInt(0, 5);
      heart.y = GAME_ROW * getRandomInt(0, 3) + 65;
    }
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

// Call helper function to create Enemy from superClass 
inherit(Enemy,Entity);

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

// Call helper function to create Player from superClass 
inherit(Player,Entity);

// Control player movement
Player.prototype.handleInput = function (keyCode) {
  var foo = keyCode;
  switch(true) {
    case (foo === "left" && this.x > 0 + CHAR_WIDTH) :
      this.x -= GAME_COL;
      break;
    case (foo === "up" && this.y > GAME_TOP_MARGIN) :
      this.y -= GAME_ROW;
      break;
    case (foo === "right" && this.x < GAME_WIDTH - GAME_COL) :
      this.x += GAME_COL;
      break;
    case (foo === "down" && this.y < GAME_HEIGHT - GAME_ROW) :
      this.y += GAME_ROW;
      break;
  }
};

// Stop game when lives reaches 0. 
Player.prototype.lossgame = function() {
  LOSS_GAME.style.display = 'block';
  GAME_OVERLAY.style.display = 'block';
  this.alive = true;
  this.playagain();
};

// Stop game when lives reaches 20.
Player.prototype.wingame = function() {
  WIN_GAME.style.display = 'block';
  GAME_OVERLAY.style.display = 'block';
  this.alive = true;
  this.youwin();
};

// Reset heart and player after display none both overlay and message
Player.prototype.playagain = function() {
    LOSS_BUTTON.addEventListener('click', function () {
    LOSS_GAME.style.display = 'none';
    GAME_OVERLAY.style.display = 'none';
    playAgain();
  });
};

// Reset heart and player after display none both overlay and message
Player.prototype.youwin = function() {
  WIN_BUTTON.addEventListener('click', function () {
    WIN_GAME.style.display = 'none';
    GAME_OVERLAY.style.display = 'none';
    playAgain();
  });
};

// Update lives and player sprite after enemy collision and getting to the water
Player.prototype.playerUpdateStatus = function() {
  // Check number of lives remaining
  switch(true) {
    case (this.lives === 0) :
      this.lossgame();
      break;
    case (this.lives === 20) :
      this.wingame();
      break;
    case (this.lives > 0 && this.lives <= 3) :
      this.sprite = BOY_3;
      break;
    case (this.lives > 3 && this.lives <= 6) :
      this.sprite = CAT_GIRL_6;
      break;
    case (this.lives > 6 && this.lives <= 9) :
      this.sprite = HORN_GIRL_9;
      break;
    case (this.lives > 9 && this.lives <= 12) :
      this.sprite = PINK_GIRL_12;
      break;
    case (this.lives > 12) :
      this.sprite = PRINCESS_GIRL_15;
      break;
  }
  // Set this back to beginning coordinates
  this.x = RESET_X;
  this.y = RESET_Y;
};

// Update lives and player status after heart collection
Player.prototype.heartUpdateStatus = function() {
  // Check number of lives remaining
  switch(true) {
    case (this.lives > 0 && this.lives <= 3) :
      this.sprite = BOY_3;
      break;
    case (this.lives > 3 && this.lives <= 6) :
      this.sprite = CAT_GIRL_6;
      break;
    case (this.lives > 6 && this.lives <= 9) :
      this.sprite = HORN_GIRL_9;
      break;
    case (this.lives > 9 && this.lives <= 12) :
      this.sprite = PINK_GIRL_12;
      break;
    case (this.lives > 12) :
      this.sprite = PRINCESS_GIRL_15;
      break;
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
    this.lossgame();
  } else if (this.alive === false && this.lives === 20) {
    // Stop game. Lives is 20.
    this.x = -99999;
    this.lives = 20;
    heart.x = -9999;
    this.wingame();
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

Player.prototype.checkCollisions = function (allEnemies) {
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
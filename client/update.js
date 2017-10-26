//when we receive a character update
const update = (data) => {
  
  // add if we do not have that character (based on their id)
  if(!squares[data.hash]) {
    squares[data.hash] = data;
    return;
  }

  //if we received an old message, just drop it
  if(squares[data.hash].lastUpdate >= data.lastUpdate) {
    return;
  }

  //grab the character based on the character id we received
  const square = squares[data.hash];
  //update their direction and movement information
  //but NOT their x/y since we are animating those
  square.prevX = data.prevX;
  square.prevY = data.prevY;
  square.destX = data.destX;
  square.destY = data.destY;
  square.direction = data.direction;
  square.moveLeft = data.moveLeft;
  square.moveRight = data.moveRight;
  square.moveDown = data.moveDown;
  square.gravitySpeed = data.gravitySpeed;
  square.alpha = 0.02;
};

//function to remove a character from our character list
const removeUser = (data) => {
  //if we have that character, remove them
  if(squares[data.hash]) {
    delete squares[data.hash];
  }
};

//function to set this user's character
const setUser = (data) => {
  hash = data.hash; //set this user's hash to the unique one they received
  squares[hash] = data; //set the character by their hash
  
  requestAnimationFrame(redraw); //start animating
};

//update this user's positions based on keyboard input
const updatePosition = () => {
  const square = squares[hash];

  //move the last x/y to our previous x/y variables
  square.prevX = square.x;
  square.prevY = square.y;
  
  if(square.moveDown && square.destY < 400) {
    square.speedY = - 10;
  }

  //if user is moving left, decrease x
  if(square.moveLeft && square.destX > 0) {
    square.destX -= 2;
  }
  //if user is moving right, increase x
  if(square.moveRight && square.destX < 400) {
    square.destX += 2;
  }

  if(square.moveDown && square.moveLeft) square.direction = directions.LEFT;

  if(square.moveDown && square.moveRight) square.direction = directions.RIGHT;

  if(square.moveLeft && !(square.moveUp || square.moveDown)) square.direction = directions.LEFT;

  if(square.moveRight && !(square.moveUp || square.moveDown)) square.direction = directions.RIGHT;

  //reset this character's alpha so they are always smoothly animating
  square.alpha = 0.05;

  //send the updated movement request to the server to validate the movement.
  socket.emit('movementUpdate', square);
};
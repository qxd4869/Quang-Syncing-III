// our socket code for physics to send updates back
const sockets = require('./sockets.js');

const gravityFall = (data) => {
      if (data.moveDown || data.destY < 378) {
        data.gravitySpeed += data.gravity;
        data.destY += data.speedY + data.gravitySpeed;
        console.log(data.destY);
      }
      if (data.destY >= 378) {
        data.moveDown = false;
      }
};


module.exports.gravityFall = gravityFall;
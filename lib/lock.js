var config = require('../config'),

    currentYear = new Date().getFullYear(),
    lockTime = new Date(config.lockTimes[currentYear]);

module.exports = {
  lockTime: lockTime,
  isOpen: function() {
    var now = new Date().getTime();
    return (lockTime.getTime() - now > 0);
  }
};
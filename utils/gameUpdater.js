const Stat = require('../models/Stat');

exports.updateStats = async (_id, update) => {
  console.log(`Update Stats`);
  const stats = await Stat.findOneAndUpdate({ user: _id }, update, {
    new: true,
    runValidators: true,
    context: 'query'
  });
};

exports.syncStats = async _id => {
  const stats = await Stat.findOne({ user: _id });
  return new Promise((resolve, reject) => {
    if (stats) {
      return resolve(stats);
    } else {
      return reject('Something went wrong');
    }
  });
};

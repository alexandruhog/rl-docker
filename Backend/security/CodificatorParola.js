const bcrypt = require('bcryptjs');

module.exports.cripteaza = async (plainTextPassword) => {

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(plainTextPassword, salt);
  return hashedPassword;
  
};

module.exports.compara = async (plainTextPassword, hashedPassword) => {

  const match = await bcrypt.compare(plainTextPassword, hashedPassword);
  return match;

};

const bcrypt = require('bcryptjs');

const plainPassword = 'Password@123'; // Replace with your password
const hashedPassword = '$2a$10$3k5ezes8Umcc7Mts.0Jck.xz7sBHn4MC2dNC47jVQLNUiOYkMLljm'; // Replace with the hash from DB

bcrypt.compare(plainPassword, hashedPassword, (err, result) => {
  if (err) console.error('Error comparing passwords:', err);
  else console.log('Password match result:', result);
});

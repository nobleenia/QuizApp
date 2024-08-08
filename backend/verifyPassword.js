const bcrypt = require('bcryptjs');

// The plain text password you want to verify
const password = 'guidinglight';

// The hashed password retrieved from the database
const hashedPassword =
  '$2a$10$NOuP63A8xac4XeaukASVGuu/U7hmejU6s1rmwiWjetmYkTFgR8gvW';

bcrypt.compare(password, hashedPassword, (err, isMatch) => {
  if (err) {
    console.error('Error during password comparison:', err);
  } else {
    console.log('Password match:', isMatch);
  }
});

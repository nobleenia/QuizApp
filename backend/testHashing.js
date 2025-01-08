const bcrypt = require('bcryptjs');

const plainPassword = 'Password@456'; // Password used during registration
const hashedPassword = '$2a$10$RhJds..65MgRlZw/mCfMI.mqJGoND5v0Ag8I3kjCFeKGe0EpsRtve'; // Retrieved from DB

bcrypt.compare(plainPassword, hashedPassword, (err, isMatch) => {
  if (err) throw err;
  console.log('Password match result:', isMatch);
});

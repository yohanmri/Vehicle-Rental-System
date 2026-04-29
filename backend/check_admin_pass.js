const bcrypt = require('bcryptjs');
const hash = "$2a$10$WRGpLfrKvElhL30BcmNRMuXMx2DC4jrd7WTObDHgHJQWSfFpObSHa";

async function testPass(pass) {
  const match = await bcrypt.compare(pass, hash);
  if (match) console.log(`Password is: ${pass}`);
}

testPass('admin123');
testPass('admin');
testPass('password');
testPass('123456');
testPass('admin@123');
testPass('Admin123!');

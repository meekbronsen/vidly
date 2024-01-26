const bcrypt = require('bcrypt'); // Returns an object

// bycrpt needs to know what salt used during verification
// To hash a password we need a salt
// A salt is a random string that is added before the password's hash
// Number of rounds we are going to run this algo to generate a salt. The higher the number, the longer it's going to take to generate the salt and the harder to break the salt
async function generateHash(){
    const salt = await bcrypt.genSalt(10); // generate a Salt
    const hashed = await bcrypt.hash("1234", salt); // hash the password and the salt
    console.log(hashed)
}

generateHash()
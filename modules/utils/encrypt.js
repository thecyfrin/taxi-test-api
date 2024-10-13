const bcrypt = require('bcrypt');

const hashData = async (data, saltRounds = 10) => {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
}

const compareHashData = async (first, second) => {
    const isSame = await bcrypt.compare(first, second);
    return isSame;
}

module.exports = {hashData, compareHashData};
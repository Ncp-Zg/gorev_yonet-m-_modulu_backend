const jwt =require("jsonwebtoken");

const jwtGenerator = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:"1m"
    })
}

module.exports = jwtGenerator;

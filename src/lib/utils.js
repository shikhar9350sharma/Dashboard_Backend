import jwt from 'jsonwebtoken';
export const generateToken = async (userId, res)=>{  
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn:"7d"
    })
    res.cookie('jwt', token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in miliseconds
        httpOnly: true,  //preventing by attacks (cross-site scripting attack)
        // sameSite: "strict", //for preventing by attacks
        sameSite: 'None', // allows cross-origin cookies
        secure: process.env.NODE_ENV !== "development"
    })
    return token;
}
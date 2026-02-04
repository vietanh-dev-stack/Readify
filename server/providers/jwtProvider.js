import jwt from 'jsonwebtoken'


const JwtProvider = {

    generateToken: async (userInfo, secretSignature, tokenLife) => {
        try {
            return jwt.sign(userInfo, secretSignature, { algorithm: 'HS256', expiresIn: tokenLife })
        } catch (error) {
            throw error
        }
    },

    verifyToken: async (token, secretSignature) => {
        try {
            return jwt.verify(token, secretSignature)
        } catch (error) {
            throw error
        }
    }
}

export default JwtProvider
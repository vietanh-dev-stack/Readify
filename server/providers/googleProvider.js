import { OAuth2Client } from 'google-auth-library'
import env from '../configs/environment.js'

const client = new OAuth2Client(env.GOOGLE_CLIENT_ID)

const verifyGoogleToken = async (token) => {

    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: env.GOOGLE_CLIENT_ID
    })

    return ticket.getPayload()
}

export default { verifyGoogleToken }
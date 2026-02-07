import nodemailer from 'nodemailer'
import env from '../configs/environment.js'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.MAIL_ACCOUNT,
        pass: env.MAIL_PASSWORD
    }
})

const mailProvider = {
    sendMail: async ({ to, subject, text, html }) => {
        return await transporter.sendMail({
            from: env.MAIL_ACCOUNT,
            to,
            subject,
            text,
            html
        })
    }
}

export default mailProvider

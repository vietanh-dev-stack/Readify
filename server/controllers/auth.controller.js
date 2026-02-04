import { StatusCodes } from "http-status-codes"
import env from "../configs/environment.js"
import userService from '../services/auth.service.js'


const authController = {
    
    login: async(req, res, next) => {
        try {
            
        } catch (error) {
            next(error)
        }
    },


    register: async (req, res, next) => {
        try {
            
        } catch (error) {
            next(error)
        }
    }
}

export default authController
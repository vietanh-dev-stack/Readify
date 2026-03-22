import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/apiError.js"
import Address from '../models/address.model.js'
import mongoose from "mongoose"

const addressService = {

    createAddress: async (userId, data) => {
        try {
            // 1. Reset default
            if (data.isDefault) {
                await Address.updateMany(
                    { userId },
                    { isDefault: false }
                )
            }

            const count = await Address.countDocuments({ userId })
            const isDefault = count === 0 ? true : (data.isDefault || false)
            // 2. Tạo address
            const [newAddress] = await Address.create([{
                userId,
                name: data.name,
                phone: data.phone,
                province: data.province,
                district: data.district,
                ward: data.ward,
                street: data.street,
                fullAddress: `${data.street}, ${data.ward}, ${data.district}, ${data.province}`,
                isDefault
            }])

            return newAddress
        } catch (error) {
            throw error
        }
    },

    getAddress: async (userId) => {
        try {
            const address = await Address.find({ userId }).sort({ isDefault: -1 })
            return address
        } catch (error) {
            throw error
        }
    },

    updateAddress: async (addressId, userId, data) => {
        try {
            const address = await Address.findById(addressId)

            if (!address) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
            }

            if (address.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'No permission')
            }

            // reset default
            if (data.isDefault) {
                await Address.updateMany(
                    { userId },
                    { isDefault: false }
                )
            }

            // update fields
            if (data.name !== undefined) address.name = data.name
            if (data.phone !== undefined) address.phone = data.phone
            if (data.province !== undefined) address.province = data.province
            if (data.district !== undefined) address.district = data.district
            if (data.ward !== undefined) address.ward = data.ward
            if (data.street !== undefined) address.street = data.street
            if (
                data.street !== undefined ||
                data.ward !== undefined ||
                data.district !== undefined ||
                data.province !== undefined
            ) {
                address.fullAddress = `${address.street}, ${address.ward}, ${address.district}, ${address.province}`
            }
            if (data.isDefault !== undefined) address.isDefault = data.isDefault

            await address.save({})

            return address
        } catch (error) {
            throw error
        }
    },

    deleteAddress: async (addressId, userId) => {
        try {
            const address = await Address.findById(addressId)

            if (!address) {
                throw new ApiError(StatusCodes.NOT_FOUND, 'Address not found')
            }

            if (address.userId.toString() !== userId.toString()) {
                throw new ApiError(StatusCodes.FORBIDDEN, 'No permission')
            }

            await Address.deleteOne({ _id: addressId })

            return { message: 'Deleted successfully' }

        } catch (error) {
            throw error
        }
    }
}

export default addressService
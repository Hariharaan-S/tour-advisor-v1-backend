import User from "../model/user.model.js";

export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }   
};

export const findUserByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        console.error("Error finding user by email:", error);
        throw error;
    }
};

export const findUserById = async (id) => {
    try {
        return await User.findById(id);
    } catch (error) {
        console.error("Error finding user by ID:", error);
        throw error;
    }
};

import { Context } from "hono";
import * as jwt from "jsonwebtoken"
import * as bcrypt from "bcryptjs";
import prisma from "../../prisma/client";

const JWT_SECRET = 'bceb313112646bce60e1b84e4e9fbcb770545e4082663e535312757aaf732e7b'

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: any) => {
    return c.json({ success, message, data });
};

export const register = async (c: Context) => {
    const { nama, username, password, role, id_outlet } = await c.req.json();

    const existingUser = await prisma.users.findUnique({
        where: { username },
    });

    if (existingUser) {
        return sendResponse(c, 400, false, "Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
        data: {
            nama,
            username,
            password: hashedPassword,
            role,
            id_outlet,
        },
    });

    return sendResponse(c, 201, true, "User created successfully", user);
};

export const login = async (c: Context) => {
    try {
        console.log("Raw request body:", await c.req.text());
        const { username, password } = await c.req.json();
        console.log("Parsed request body:", { username, password });

        if (!username || !password) {
            return sendResponse(c, 400, false, "Username and password are required");
        }

        const user = await prisma.users.findFirst({ where: { username } });

        if (!user) {
            return sendResponse(c, 401, false, 'Invalid username or password');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return sendResponse(c, 401, false, 'Invalid username or password');
        }

        const token = jwt.sign(
            { id: user.id, nama: user.nama, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return sendResponse(c, 200, true, 'Logged in successfully', { token });
    } catch (err) {
        console.error("Error in login:", err);
        return sendResponse(c, 500, false, "Internal Server Error");
    }
};


export const logout = async (c: Context) => {
    return sendResponse(c, 200, true, "Logged out successfully");
}
import { Context } from "hono";
import { z } from "zod";
import prisma from "../../prisma/client";
import * as bcrypt from "bcryptjs";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: unknown) => {
    return c.json({ success, message, data });
};

const userSchema = z.object({
    nama: z.string()
        .min(3, 'Name must be at least 3 characters long.')
        .max(50, 'Name can be at most 50 characters long.'),
    username: z.string()
        .min(3, 'Username must be at least 3 characters long.')
        .max(50, 'Username can be at most 50 characters long.'),
    password: z.string()
        .min(6, 'Password must be at least 6 characters long.')
        .max(50, 'Password can be at most 50 characters long.'),
    id_outlet: z.coerce.number()
        .positive('Outlet ID must be a positive number greater than 0.'),
    role: z.enum(['admin', 'kasir', 'owner']).refine(val => ['admin', 'kasir', 'owner'].includes(val), {
        message: 'Role must be one of: admin, kasir, or owner.',
    }),
});


const userSchemaPartial = userSchema.partial();

export async function getUsers(c: Context) {
    try {
        const users = await prisma.users.findMany({
            include: {
                outlets: true,
            },
            orderBy: { id: 'asc' },
        });
        return sendResponse(c, 200, true, 'Success', users);
    } catch (error) {
        console.error(`Error fetching users: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch users');
    }
}

export async function getUserById(c: Context) {
    try {
        const id = await c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Missing ID parameter');
        }
        const users = await prisma.users.findUnique({
            where: { id: Number(id) },
        })
        if(!users) {
            return sendResponse(c, 404, false, 'User not found');
        }
    
        return sendResponse(c, 200, true, 'Success', users);
    } catch (e) {
        console.error(`Error fetching user by ID: ${e}`);
        return sendResponse(c, 500, false, `Failed to fetch user by ID: ${e}`);
    }
}

export async function createUser(c: Context) {
    try {
        const body = await c.req.parseBody();
        const parseBody = userSchema.parse(body);

        const hashedPassword = bcrypt.hashSync(parseBody.password, 8);

        const user = await prisma.users.create({
            data: {
                ...parseBody,
                password: hashedPassword,
            },
        });

        return sendResponse(c, 201, true, 'User created successfully', user);
    } catch (error) {
        console.error(`Error creating user: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        return sendResponse(c, 500, false, 'Failed to create user');
    }
}

export async function updateUser(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'User ID is required');
        }

        const body = await c.req.parseBody();
        const parseBody = userSchemaPartial.parse(body);

        const updatedData = { ...parseBody };
        if (parseBody.password) {
            const hashedPassword = bcrypt.hashSync(parseBody.password, 8);
            updatedData.password = hashedPassword;
        }

        const user = await prisma.users.update({
            where: { id: Number(id) },
            data: updatedData,
        });

        return sendResponse(c, 200, true, 'User updated successfully', user);
    } catch (error) {
        console.error(`Error updating user: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'User not found');
        }
        return sendResponse(c, 500, false, 'Failed to update user');
    }
}

export async function deleteUser(c: Context) {
    try {
        const id = await c.req.param('id');
        if(!id) {
            return sendResponse(c, 400, false, 'User ID is required');
        }

        await prisma.users.delete({
            where: { id: Number(id) },
        })

        return sendResponse(c, 200, true, 'User deleted successfully');
    } catch (e) {
        console.error(`Error deleting user: ${e}`);
        return sendResponse(c, 500, false, 'Failed to delete user');
    }
}
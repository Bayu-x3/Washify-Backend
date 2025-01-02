import { Context } from "hono";
import { z } from "zod";
import prisma from "../../prisma/client";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: unknown) => {
    return c.json({ success, message, data });
};

const outletSchema = z.object({
    nama: z.string().min(1, 'Nama is required'),
    alamat: z.string().min(1, 'Alamat is required'),
    tlp: z.coerce.number().min(1, 'Phone Number is required'),
});

export async function getOutlets(c: Context) {
    try {
        const outlet = await prisma.outlets.findMany({
            orderBy: { id: 'asc' },
        });
        return sendResponse(c, 200, true, 'Success', outlet);
    } catch (error: unknown) {
        console.error(`Error getting outlets: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch outlets');
    }
}

export async function getOutletById(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Outlet ID is required');
        }

        const outlet = await prisma.outlets.findUnique({
            where: { id: Number(id) },
        });

        if (!outlet) {
            return sendResponse(c, 404, false, 'Outlet not found');
        }

        return sendResponse(c, 200, true, 'Success', outlet);
    } catch (error: unknown) {
        console.error(`Error getting outlet by ID: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch outlet');
    }
}

export async function createOutlets(c: Context) {
    try {
        const body = await c.req.parseBody();
        const parseBody = outletSchema.parse(body);

        const outlets = await prisma.outlets.create({
            data: parseBody,
        });

        return sendResponse(c, 201, true, 'Outlet created successfully', outlets);
    } catch (error: unknown) {
        console.error(`Error creating outlet: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        return sendResponse(c, 500, false, 'Failed to create outlet');
    }
}

export async function updateOutlets(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Outlet ID is required');
        }

        const body = await c.req.parseBody();
        const parseBody = outletSchema.partial().parse(body);

        const outlet = await prisma.outlets.update({
            where: { id: Number(id) },
            data: parseBody,
        });

        return sendResponse(c, 200, true, 'Outlet updated successfully', outlet);
    } catch (error: unknown) {
        console.error(`Error updating post: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'Post not found');
        }
        return sendResponse(c, 500, false, 'Failed to update post');
    }
}

export async function deleteOutlets(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Outlet ID is required');
        }

        await prisma.outlets.delete({
            where: { id: Number(id) },
        });

        return sendResponse(c, 200, true, 'Outlet deleted successfully');
    } catch (error: unknown) {
        console.error(`Error deleting post: ${error}`);
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'Post not found');
        }
        return sendResponse(c, 500, false, 'Failed to delete post');
    }
}

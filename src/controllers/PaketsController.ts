import { Context } from "hono";
import { z } from "zod";
import prisma from "../../prisma/client";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: unknown) => {
    return c.json({ success, message, data });
};

const paketSchema = z.object({
    id_outlet: z.coerce.number()
      .positive('Outlet ID must be a positive number greater than 0.'),
    
    jenis: z.enum(['kiloan', 'selimut', 'bed_cover', 'kaos', 'lain']).refine(val => ['kiloan', 'selimut', 'bed_cover', 'kaos', 'lain'].includes(val), {
      message: 'Jenis must be one of the following: kiloan, selimut, bed_cover, kaos, lain.',
    }),
  
    nama_paket: z.string()
      .min(1, 'Package name cannot be empty. Please provide a valid name for the package.')
      .max(100, 'Package name must not exceed 100 characters.'),
  
    harga: z.coerce.number()
      .min(1, 'Price must be a positive number. Please enter a valid price.')
      .int('Price must be an integer value.')
      .positive('Price must be a positive number greater than 0.'),
  });
  

const paketSchemaPartial = paketSchema.partial();

export async function getPakets(c: Context) {
    try {
        const users = await prisma.pakets.findMany({
            include: {
                outlets: true,
            },
            orderBy: { id: 'asc' },
        });
        return sendResponse(c, 200, true, 'Success', users);
    } catch (error) {
        console.error(`Error fetching pakets: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch pakets');
    }
}

export async function getPaketById(c: Context) {
    try {
        const id = await c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Missing ID parameter');
        }
        const pakets = await prisma.pakets.findUnique({
            where: { id: Number(id) },
        })
        if(!pakets) {
            return sendResponse(c, 404, false, 'Paket not found');
        }
    
        return sendResponse(c, 200, true, 'Success', pakets);
    } catch (e) {
        console.error(`Error fetching paket by ID: ${e}`);
        return sendResponse(c, 500, false, `Failed to fetch paket by ID: ${e}`);
    }
}

export async function createPaket(c: Context) {
    try {
        const body = await c.req.parseBody();
        const parseBody = paketSchema.parse(body);
        const createData = { ...parseBody };

        const pakets = await prisma.pakets.create({
            data: createData,
        });

        return sendResponse(c, 201, true, 'Paket created successfully', pakets);
    } catch (error) {
        console.error(`Error creating paket: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        return sendResponse(c, 500, false, 'Failed to create paket');
    }
}


export async function updatePaket(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'User ID is required');
        }

        const body = await c.req.parseBody();
        const parseBody = paketSchemaPartial.parse(body);

        const updatedData = { ...parseBody };

        const pakets = await prisma.pakets.update({
            where: { id: Number(id) },
            data: updatedData,
        });

        return sendResponse(c, 200, true, 'pakets updated successfully', pakets);
    } catch (error) {
        console.error(`Error updating pakets: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'pakets not found');
        }
        return sendResponse(c, 500, false, 'Failed to update pakets');
    }
}

export async function deletePaket(c: Context) {
    try {
        const id = await c.req.param('id');
        if(!id) {
            return sendResponse(c, 400, false, 'paket ID is required');
        }

        await prisma.pakets.delete({
            where: { id: Number(id) },
        })

        return sendResponse(c, 200, true, 'paket deleted successfully');
    } catch (e) {
        console.error(`Error deleting paket: ${e}`);
        return sendResponse(c, 500, false, 'Failed to delete paket');
    }
}
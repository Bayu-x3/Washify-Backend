import { Context } from "hono";
import { z } from "zod";
import prisma from "../../prisma/client";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: unknown) => {
    return c.json({ success, message, data });
};

const detailTransaksiSchema = z.object({
    id_transaksi: z.number().positive('Transaction ID must be a positive number.'),
    id_paket: z.number().positive('Package ID must be a positive number.'),
    qty: z.number().nonnegative('Quantity must be non-negative.'),
    keterangan: z.string().min(1, 'Description is required.'),
});

const detailTransaksiSchemaPartial = detailTransaksiSchema.partial();

export async function getDetailTransaksi(c: Context) {
    try {
        const details = await prisma.detailTransaksi.findMany({
            include: {
                transaksi: true,
                paket: true,
            },
            orderBy: { id: 'asc' },
        });

        return sendResponse(c, 200, true, 'Success', details);
    } catch (error) {
        console.error(`Error fetching details: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch details');
    }
}

export async function getDetailTransaksiById(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Detail Transaction ID is required');
        }

        const detail = await prisma.detailTransaksi.findUnique({
            where: { id: Number(id) },
            include: {
                transaksi: true,
                paket: true,
            },
        });

        if (!detail) {
            return sendResponse(c, 404, false, 'Detail Transaction not found');
        }

        return sendResponse(c, 200, true, 'Success', detail);
    } catch (error) {
        console.error(`Error fetching detail: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch detail');
    }
}

export async function createDetailTransaksi(c: Context) {
    try {
        const body = await c.req.json();
        const parseBody = detailTransaksiSchema.parse(body);

        const detail = await prisma.detailTransaksi.create({
            data: parseBody,
        });

        return sendResponse(c, 201, true, 'Detail Transaction created successfully', detail);
    } catch (error) {
        console.error(`Error creating detail: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        return sendResponse(c, 500, false, 'Failed to create detail');
    }
}

export async function updateDetailTransaksi(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Detail Transaction ID is required');
        }

        const body = await c.req.json();
        const parseBody = detailTransaksiSchemaPartial.parse(body);

        const detail = await prisma.detailTransaksi.update({
            where: { id: Number(id) },
            data: parseBody,
        });

        return sendResponse(c, 200, true, 'Detail Transaction updated successfully', detail);
    } catch (error) {
        console.error(`Error updating detail: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'Detail Transaction not found');
        }
        return sendResponse(c, 500, false, 'Failed to update detail');
    }
}

export async function deleteDetailTransaksi(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Detail Transaction ID is required');
        }

        await prisma.detailTransaksi.delete({
            where: { id: Number(id) },
        });

        return sendResponse(c, 200, true, 'Detail Transaction deleted successfully');
    } catch (error) {
        console.error(`Error deleting detail: ${error}`);
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'Detail Transaction not found');
        }
        return sendResponse(c, 500, false, 'Failed to delete detail');
    }
}

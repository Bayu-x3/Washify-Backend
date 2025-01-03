import { Context } from "hono";
import { z } from "zod";
import prisma from "../../prisma/client";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: unknown) => {
    return c.json({ success, message, data });
};

const transaksiSchema = z.object({
    id_outlet: z.number().positive('Outlet ID must be a positive number.'),
    kode_invoice: z.string()
        .min(1, 'Invoice code is required.')
        .max(100, 'Invoice code can be at most 100 characters.'),
    id_member: z.number().positive('Member ID must be a positive number.'),
    tgl: z.coerce.date(),
    batas_waktu: z.coerce.date(),
    tgl_bayar: z.coerce.date().nullable().optional(),
    biaya_tambahan: z.number().nonnegative('Additional cost must be non-negative.'),
    diskon: z.number().nonnegative('Discount must be non-negative.').max(100, 'Discount cannot exceed 100%'),
    pajak: z.number().nonnegative('Tax must be non-negative.'),
    status: z.enum(['baru', 'proses', 'selesai', 'diambil']),
    dibayar: z.enum(['dibayar', 'belum_dibayar']),
    id_user: z.number().positive('User ID must be a positive number.'),
});

const transaksiSchemaPartial = transaksiSchema.partial();


export async function getTransaksi(c: Context) {
    try {
        const transaksi = await prisma.transaksi.findMany({
            include: {
                outlets: true,
                members: true,
                users: true,
            },
            orderBy: { id: 'asc' },
        });

        return sendResponse(c, 200, true, 'Success', transaksi);
    } catch (error) {
        console.error(`Error fetching transactions: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch transactions');
    }
}


export async function getTransaksiById(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Transaction ID is required');
        }

        const transaksi = await prisma.transaksi.findUnique({
            where: { id: Number(id) },
            include: {
                outlets: true,
                members: true,
                users: true,
            },
        });

        if (!transaksi) {
            return sendResponse(c, 404, false, 'Transaction not found');
        }

        return sendResponse(c, 200, true, 'Success', transaksi);
    } catch (error) {
        console.error(`Error fetching transaction: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch transaction');
    }
}

export async function createTransaksi(c: Context) {
    try {
        const body = await c.req.json();
        const parseBody = transaksiSchema.parse(body);

        const transaksi = await prisma.transaksi.create({
            data: {
                ...parseBody,
                tgl_bayar: parseBody.tgl_bayar ?? null,
            },
        });
        
        return sendResponse(c, 201, true, 'Transaction created successfully', transaksi);
    } catch (error) {
        console.error(`Error creating transaction: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        return sendResponse(c, 500, false, 'Failed to create transaction');
    }
}

export async function updateTransaksi(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Transaction ID is required');
        }

        const body = await c.req.json();
        const parseBody = transaksiSchemaPartial.parse(body);

        const transaksi = await prisma.transaksi.update({
            where: { id: Number(id) },
            data: {
                ...parseBody,
                tgl_bayar: parseBody.tgl_bayar ?? null,
            },
        });

        return sendResponse(c, 200, true, 'Transaction updated successfully', transaksi);
    } catch (error) {
        console.error(`Error updating transaction: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'Transaction not found');
        }
        return sendResponse(c, 500, false, 'Failed to update transaction');
    }
}

export async function deleteTransaksi(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Transaction ID is required');
        }
        await prisma.detailTransaksi.deleteMany({
            where: { id_transaksi: Number(id) },
        });

        // Hapus transaksi
        await prisma.transaksi.delete({
            where: { id: Number(id) },
        });

        return sendResponse(c, 200, true, 'Transaction and related data deleted successfully');
    } catch (error) {
        console.error(`Error deleting transaction: ${error}`);
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'Transaction not found');
        }
        return sendResponse(c, 500, false, 'Failed to delete transaction');
    }
}

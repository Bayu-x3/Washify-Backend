import { Context } from "hono";
import { z } from "zod";
import prisma from "../../prisma/client";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: unknown) => {
    return c.json({ success, message, data });
};

const memberSchema = z.object({
    nama: z.string()
        .min(3, 'Name must be at least 3 characters long.')
        .max(50, 'Name can be at most 50 characters long.'),
    alamat: z.string()
        .min(3, 'alamat must be at least 3 characters long.')
        .max(100, 'alamat can be at most 100 characters long.'),
    jenis_kelamin: z.enum(['laki_laki', 'perempuan']).refine(val => ['laki_laki', 'perempuan'].includes(val), {
        message: 'jenis kelamin must be one of: laki laki, perempuan.',
    }),
    tlp: z.coerce.number()
    .min(1, 'Phone number cannot be empty. Please provide a valid phone number.')
    .int('Phone number must be an integer value.')
    .positive('Phone number must be a positive number.'),
});

const memberSchemaPartial = memberSchema.partial();

export async function getMembers(c: Context) {
    try {
        const members = await prisma.members.findMany({
            orderBy: { id: 'asc' },
        });
        return sendResponse(c, 200, true, 'Success', members);
    } catch (error) {
        console.error(`Error fetching members: ${error}`);
        return sendResponse(c, 500, false, 'Failed to fetch members');
    }
}

export async function getMemberById(c: Context) {
    try {
        const id = await c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Missing ID parameter');
        }
        const members = await prisma.members.findUnique({
            where: { id: Number(id) },
        })
        if(!members) {
            return sendResponse(c, 404, false, 'Member not found');
        }
    
        return sendResponse(c, 200, true, 'Success', members);
    } catch (e) {
        console.error(`Error fetching Member by ID: ${e}`);
        return sendResponse(c, 500, false, `Failed to fetch Member by ID: ${e}`);
    }
}

export async function createMember(c: Context) {
    try {
        const body = await c.req.json();
        const parseBody = memberSchema.parse(body);
        const createData = { ...parseBody };

        const members = await prisma.members.create({
            data: createData,
        });

        return sendResponse(c, 201, true, 'Member created successfully', members);
    } catch (error) {
        console.error(`Error creating Member: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        return sendResponse(c, 500, false, 'Failed to create Member');
    }
}


export async function updateMember(c: Context) {
    try {
        const id = c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'User ID is required');
        }

        const body = await c.req.json();
        const parseBody = memberSchemaPartial.parse(body);

        const updatedData = { ...parseBody };

        const members = await prisma.members.update({
            where: { id: Number(id) },
            data: updatedData,
        });

        return sendResponse(c, 200, true, 'members updated successfully', members);
    } catch (error) {
        console.error(`Error updating members: ${error}`);
        if (error instanceof z.ZodError) {
            return sendResponse(c, 400, false, 'Validation error', error.errors);
        }
        if ((error as { code?: string }).code === 'P2025') {
            return sendResponse(c, 404, false, 'members not found');
        }
        return sendResponse(c, 500, false, 'Failed to update members');
    }
}

export async function deleteMember(c: Context) {
    try {
        const id = await c.req.param('id');
        if (!id) {
            return sendResponse(c, 400, false, 'Member ID is required');
        }

        await prisma.detailTransaksi.deleteMany({
            where: { id_transaksi: { in: await prisma.transaksi.findMany({ where: { id_member: Number(id) }, select: { id: true } }).then((transaksi) => transaksi.map((t) => t.id)) } },
        });

        await prisma.transaksi.deleteMany({
            where: { id_member: Number(id) },
        });

        await prisma.members.delete({
            where: { id: Number(id) },
        });

        return sendResponse(c, 200, true, 'Member and related data deleted successfully');
    } catch (e) {
        console.error(`Error deleting member: ${e}`);
        return sendResponse(c, 500, false, 'Failed to delete member');
    }
}

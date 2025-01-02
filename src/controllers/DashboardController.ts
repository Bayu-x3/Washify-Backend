import { Context } from "hono";
import prisma from "../../prisma/client";

const sendResponse = (c: Context, status: number, success: boolean, message: string, data?: any) => {
    return c.json({ success, message, data });
};


export const getDashboardData = async (c: Context) => {
    try {
        const users = c.get("user");
        const username = users?.nama || "Guest";
        const userRole = users?.role || "Unknown";

        // Cek peran pengguna
        if (!["admin", "kasir", "owner"].includes(userRole)) {
            return sendResponse(c, 403, false, "Unauthorized. Only admin, kasir, and owner can perform this action.");
        }

        // 1. Jumlah Transaksi Hari Ini
        const today = new Date();
        const startOfToday = new Date(today.setHours(0, 0, 0, 0));
        const transactionsToday = await prisma.transaksi.count({
            where: { tgl: { gte: startOfToday } },
        });

        // Transaksi Hari Ini Bulan Lalu
        const startOfLastMonthToday = new Date(today.setMonth(today.getMonth() - 1));
        const transactionsLastMonthToday = await prisma.transaksi.count({
            where: { tgl: { gte: startOfLastMonthToday, lt: startOfToday } },
        });

        const percentTransactionsToday =
            transactionsLastMonthToday > 0
                ? ((transactionsToday - transactionsLastMonthToday) / transactionsLastMonthToday) * 100
                : 0;

        // 2. Pendapatan Hari Ini
        const revenueToday = await prisma.transaksi.aggregate({
            _sum: {
                biaya_tambahan: true,
                diskon: true,
                pajak: true,
            },
            where: {
                tgl_bayar: { gte: startOfToday },
                dibayar: "dibayar",
            },
        });

        const revenueLastMonthToday = await prisma.transaksi.aggregate({
            _sum: {
                biaya_tambahan: true,
                diskon: true,
                pajak: true,
            },
            where: {
                tgl_bayar: { gte: startOfLastMonthToday, lt: startOfToday },
                dibayar: "dibayar",
            },
        });

        const percentRevenueToday =
    (revenueLastMonthToday?._sum.biaya_tambahan ?? 0) > 0
        ? ((revenueToday?._sum.biaya_tambahan ?? 0) - (revenueLastMonthToday?._sum.biaya_tambahan ?? 0)) /
          (revenueLastMonthToday?._sum.biaya_tambahan ?? 0) * 100
        : 0;


        // 3. Jumlah Member
        const totalMembers = await prisma.members.count();
        const totalMembersLastMonth = await prisma.members.count({
            where: {
                created_at: { lt: startOfLastMonthToday },
            },
        });

        const percentMembers =
            totalMembersLastMonth > 0 ? ((totalMembers - totalMembersLastMonth) / totalMembersLastMonth) * 100 : 0;

        // 4. Jumlah Outlet
        const totalOutlets = await prisma.outlets.count();
        const totalOutletsLastMonth = await prisma.outlets.count({
            where: {
                created_at: { lt: startOfLastMonthToday },
            },
        });

        const percentOutlets =
            totalOutletsLastMonth > 0 ? ((totalOutlets - totalOutletsLastMonth) / totalOutletsLastMonth) * 100 : 0;

        // 5. Status Transaksi
        const statusCounts = await prisma.transaksi.groupBy({
            by: ["status"],
            _count: true,
        });

        // 6. Paket Paling Banyak Dipesan
        const popularPackage = await prisma.detailTransaksi.groupBy({
            by: ["id_paket"],
            _sum: { qty: true },
            orderBy: { _sum: { qty: "desc" } },
            take: 1,
        });

        const packageDetails = popularPackage[0]
            ? await prisma.pakets.findUnique({ where: { id: popularPackage[0].id_paket } })
            : null;

        // 7. Top Member Berdasarkan Transaksi
        const topMember = await prisma.transaksi.groupBy({
            by: ["id_member"],
            _count: { id: true },
            orderBy: { _count: { id: "desc" } },
            take: 1,
        });

        const topMemberDetails = topMember[0]
            ? await prisma.members.findUnique({ where: { id: topMember[0].id_member } })
            : null;

        // 8. Notifikasi Transaksi Belum Dibayar
        const pendingTransactions = await prisma.transaksi.count({
            where: { dibayar: "belum_dibayar" },
        });

        return sendResponse(
            c,
            200,
            true,
            "Dashboard data retrieved successfully",
            {
                user: { nama: username, role: userRole },
                statistics: {
                    transactionsToday,
                    percentTransactionsToday,
                    revenueToday,
                    percentRevenueToday,
                    totalMembers,
                    percentMembers,
                    totalOutlets,
                    percentOutlets,
                },
                transactionStatus: statusCounts,
                mostPopularPackage: packageDetails,
                topMember: topMemberDetails,
                notifications: { pendingTransactions },
            }
        );
    } catch (err) {
        console.error("Error fetching dashboard data:", err);
        return sendResponse(c, 500, false, "Internal Server Error");
    }
};

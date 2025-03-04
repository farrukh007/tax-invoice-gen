import { verifyToken } from "@/app/middleware/auth";
import { db } from "@/lib/db/connection";
import { Op } from "sequelize";
export const POST = verifyToken(async (req: any, res: any) => {
    if (!db.initialized) await db.initialize();
    const { startDate, endDate } = await req.json()
    const totalInvoices = await db.Invoice.count({
        where: {
            createdAt: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            }
        }
    });
    const totalClients = await db.Client.count({
        where: {
            createdAt: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            },
            type: "Client"
        }
    });
    const totalImporters = await db.Client.count({
        where: {
            createdAt: {
                [Op.gte]: startDate,
                [Op.lte]: endDate
            },
            type: "Importer"
        }
    });
    try {
        return new Response(JSON.stringify({ totalImporters, totalClients, totalInvoices }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error, "error");
        return new Response(JSON.stringify({ message: "Error occurred", error }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
});


import { verifyToken } from "@/app/middleware/auth";
import { db } from "@/lib/db/connection";
import Ajv from "ajv";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
const ajv = new Ajv();

const InvoiceSchema = {
    type: "array",
    items: {
        type: "object",
        properties: {
            invoiceNumber: { type: "string" },
            invoiceDate: { type: "string" },
            clientId: { type: "integer" },
            importerId: { type: "integer" },
            templateId: { type: "integer" },

            goods: { type: "string" },
            goodNumber: { type: "string" },

            hsCODE: { type: "string" },

            FBRCode: { type: "string" },

            quantityUnits: { type: "integer" },

            value: { type: "integer" },

            GST: { type: "integer" },

            VAT: { type: "integer" },

            unitPrice: { type: "integer" },



        },
        required: ["invoiceNumber",
            "invoiceDate",
            "clientId",
            "importerId",
            "templateId",
            "goods",
            "goodNumber",
            "hsCODE",
            "FBRCode",
            "quantityUnits",
            "value",
            "GST",
            "VAT",
            "unitPrice"],
        additionalProperties: false
    }
}


export const POST =verifyToken(async (req: any,res:any) => {
    const data = await req.json();

    if (!ajv.validate(InvoiceSchema, data)) {
        return new Response(JSON.stringify({ message: "Invalid request", errors: ajv.errors }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!db.initialized) await db.initialize();
    const invoices = await db.Invoice.bulkCreate(data)
    try {
        return new Response(JSON.stringify(invoices), {
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
}) ;


export const GET =verifyToken(async (req:any,res:any) => {
    if (!db.initialized) await db.initialize();
    const searchParams = req.nextUrl.searchParams
    let where = {
        ...(searchParams.get('invoiceNumber') && { invoiceNumber: { [Op.like]: searchParams.get('invoiceNumber') } }),
        ...(searchParams.get('clientId') && { clientId: { [Op.eq]: searchParams.get('clientId') } }),
        ...(searchParams.get('importerId') && { importerId: { [Op.eq]: searchParams.get('importerId') } }),
        ...(searchParams.get('templateId') && { templateId: { [Op.eq]: searchParams.get('templateId') } }),
        ...(searchParams.get('goods') && { goods: { [Op.like]: searchParams.get('goods') } }),
        ...(searchParams.get('goodNumber') && { goodNumber: { [Op.like]: searchParams.get('goodNumber') } }),
        ...(searchParams.get('hsCODE') && { hsCODE: { [Op.like]: searchParams.get('hsCODE') } }),
        ...(searchParams.get('FBRCode') && { FBRCode: { [Op.like]: searchParams.get('FBRCode') } }),
        ...(searchParams.get('id') && { id: searchParams.get('id') })

    } as any
    let pagination = { limit: searchParams.get('limit') ?? 100, pageNo: searchParams.get('pageNo') ?? 0 }
    const clients = await db.Invoice.findAll({ where, limit: +pagination.limit, offset: +pagination.limit * +pagination.pageNo })
    try {
        return new Response(JSON.stringify({ clients }), {
            status: 200,
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
}) ;

export const PUT =verifyToken(async (req:any,res:any) => {
    const data = await req.json();
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) return new Response(JSON.stringify({ message: "Invalid request", errors: "Missing Id" }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!ajv.validate(InvoiceSchema, data)) {
        return new Response(JSON.stringify({ message: "Invalid request", errors: ajv.errors }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!db.initialized) await db.initialize();
    const [updates] = await db.Invoice.update({ ...data }, {
        where: {
            id
        }
    })

    if (updates == 0) {
        return new Response(JSON.stringify({ message: "Invoice not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    try {
        return new Response(JSON.stringify({
            name: data.name,
            id: id
        }), {
            status: 200,
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
}) ;

export const DELETE =verifyToken( async (req:any,res:any) => {
    if (!db.initialized) await db.initialize();
    const searchParams = req.nextUrl.searchParams
    const ids = JSON.parse(searchParams.get('ids') ?? "[]")
    try {

        await db.Invoice.destroy({
            where: {
                id: ids
            }
        })
        return new Response(JSON.stringify({ message: "Template(s) Deleted successfully" }), {
            status: 200,
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
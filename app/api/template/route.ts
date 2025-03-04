import { verifyToken } from "@/app/middleware/auth";
import { db } from "@/lib/db/connection";
import Ajv from "ajv";
import { NextRequest } from "next/server";
import { Op } from "sequelize";
const ajv = new Ajv();

const TemplateSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
    },
    required: ["name"],
    additionalProperties: false
}


export const POST =verifyToken( async (req: any,res:any) => {
    const data = await req.json();

    if (!ajv.validate(TemplateSchema, data)) {
        return new Response(JSON.stringify({ message: "Invalid request", errors: ajv.errors }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!db.initialized) await db.initialize();
    const newTemplate = await db.Template.create({
        ...data
    })
    try {
        return new Response(JSON.stringify(newTemplate), {
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


export const GET =verifyToken( async (req: any,res:any) => {
    if (!db.initialized) await db.initialize();
    const searchParams = req.nextUrl.searchParams
    let where = {
        ...(searchParams.get('name') && { name: { [Op.like]: searchParams.get('name') } }),
        ...(searchParams.get('id') && { id: searchParams.get('id') })

    } as any
    let pagination = { limit: searchParams.get('limit') ?? 100, pageNo: searchParams.get('pageNo') ?? 0 }
    const templates = await db.Template.findAll({ where, limit: +pagination.limit, offset: +pagination.limit * +pagination.pageNo })
    try {
        return new Response(JSON.stringify({ templates }), {
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

export const PUT =verifyToken( async (req: any,res:any) => {
    const data = await req.json();
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')

    if (!id) return new Response(JSON.stringify({ message: "Invalid request", errors: "Missing Id" }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!ajv.validate(TemplateSchema, data)) {
        return new Response(JSON.stringify({ message: "Invalid request", errors: ajv.errors }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!db.initialized) await db.initialize();
    const [updates] = await db.Template.update({ ...data }, {
        where: {
            id
        }
    })

    if (updates == 0) {
        return new Response(JSON.stringify({ message: "Template not found" }), {
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
});

export const DELETE =verifyToken( async (req: any,res:any) => {
    if (!db.initialized) await db.initialize();
    const searchParams = req.nextUrl.searchParams
    console.log("🚀 ~ DELETE ~ searchParams:", searchParams)
    const ids = JSON.parse(searchParams.get('ids') ?? "[]")
    try {

        await db.Template.destroy({
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
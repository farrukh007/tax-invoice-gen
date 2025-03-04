import { db } from "@/lib/db/connection";
import Ajv from "ajv";
import { NextRequest } from "next/server";
import { hashPassword } from "../auth/password/route";
import { Op } from "sequelize";
import { verifyToken } from "@/app/middleware/auth";
const ajv = new Ajv();
const userSchema = {
    type: "object",
    properties: {
        username: { type: "string" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        password: { type: "string" },

        role: { type: "string" },
        teamId: { type: "integer" },

    },
    required: ["username", "firstName", "lastName", "role"],
    additionalProperties: false
}

export const POST = verifyToken(async (req: any, res: any) => {
    if (!db.initialized) await db.initialize();
    const admin = req.user;
    const data = await req.json();

    if (!ajv.validate(userSchema, data)) {
        return new Response(JSON.stringify({ message: "Invalid request", errors: ajv.errors }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (data?.teamId && data?.teamId !== admin.team) {
        return new Response(JSON.stringify({ message: "Unauthorized Operation" }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    let { password, ...ROD } = data;
    const hash = await hashPassword(password)
    await db.User.create({ ...ROD, hash })
    try {
        return new Response(JSON.stringify({ message: "User created succesfully" }), {
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
})

export const GET = verifyToken(async (req: any, res: any) => {
    if (!db.initialized) await db.initialize();
    const searchParams = req.nextUrl.searchParams
    let where = {
        ...(searchParams.get('username') && { username: { [Op.like]: searchParams.get('username') } }),
        ...(searchParams.get('firstName') && { firstName: { [Op.like]: searchParams.get('firstName') } }),
        ...(searchParams.get('lastName') && { lastName: { [Op.like]: searchParams.get('lastName') } }),
        ...(searchParams.get('role') && { role: { [Op.eq]: searchParams.get('role') } }),
        ...(searchParams.get('teamId') && { teamId: { [Op.eq]: searchParams.get('teamId') } }),

        ...(searchParams.get('id') && { id: searchParams.get('id') })

    } as any
    let pagination = { limit: searchParams.get('limit') ?? 100, pageNo: searchParams.get('pageNo') ?? 0 }
    const users = await db.User.findAll({ where, limit: +pagination.limit, offset: +pagination.limit * +pagination.pageNo })
    try {
        return new Response(JSON.stringify({ users }), {
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
})

export const PUT = verifyToken(async (req: any, res: any) => {
    const data = await req.json();
    const searchParams = req.nextUrl.searchParams
    const id = searchParams.get('id')
    const admin = req.user;
    if (!id) return new Response(JSON.stringify({ message: "Invalid request", errors: "Missing Id" }), {
        status: 400,
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (admin.role != 'admin' && admin.id != id) {
        return new Response(JSON.stringify({ message: "Unauthorized Operation" }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!ajv.validate(userSchema, data)) {
        return new Response(JSON.stringify({ message: "Invalid request", errors: ajv.errors }), {
            status: 400,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!db.initialized) await db.initialize();
    const [updates] = await db.User.update({ ...data }, {
        where: {
            id
        }
    })

    if (updates == 0) {
        return new Response(JSON.stringify({ message: "User not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    try {
        return new Response(JSON.stringify({
            ...data,
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

export const DELETE = verifyToken(async (req: any, res: any) => {
    if (!db.initialized) await db.initialize();
    const searchParams = req.nextUrl.searchParams
    console.log("🚀 ~ DELETE ~ searchParams:", searchParams)
    const ids = JSON.parse(searchParams.get('ids') ?? "[]")
    try {

        await db.User.destroy({
            where: {
                id: ids
            }
        })
        return new Response(JSON.stringify({ message: "User(s) Deleted successfully" }), {
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
})
import { db } from "@/lib/db/connection";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { hashPassword } from "../../auth/password/route";
import { verifyToken } from "@/app/middleware/auth";

export const POST = verifyToken(async (req: any, res: any) => {
    if (!db.initialized) await db.initialize();
    const user = req["user"];
    const { username, password } = await req.json();
    const foundUser = await db.User.findOne({
        where: {
            username: username
        }
    })
    if (!foundUser) {
        return new Response(JSON.stringify({ message: "User not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (foundUser?.teamId !== user.team) {
        return new Response(JSON.stringify({ message: "Unauthorized Operation" }), {
            status: 403,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    const newPassword = await hashPassword(password);
    await foundUser.update({ hash: newPassword });


    try {
        return new Response(JSON.stringify({ message: "User Password Updated" }), {
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

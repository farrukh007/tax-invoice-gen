import { db } from "@/lib/db/connection";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
export const POST = async (req: Request) => {
    if (!db.initialized) await db.initialize();
    const { username, password } = await req.json();
    const user = await db.User.findOne({
        where: {
            username
        }
    })
    if (!user) {
        return new Response(JSON.stringify({ message: "User not found" }), {
            status: 404,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    if (!await bcrypt.compare(password, user.hash)) {
        return new Response(JSON.stringify({ message: "Invalid User" }), {
            status: 401,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const token = jwt.sign({ id: user.id, username: user.username, team: user.teamId }, "SECRET_KEY", {
        expiresIn: "12h",
    });

    try {
        return new Response(JSON.stringify({ token, user: { id: user.id, username: user.username } }), {
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
};

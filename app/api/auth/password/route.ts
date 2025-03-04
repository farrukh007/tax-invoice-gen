import { verifyToken } from "@/app/middleware/auth";
import { db } from "@/lib/db/connection";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}
export const PUT = verifyToken(async (req: any, res: any) => {
    if (!db.initialized) await db.initialize();
    const user = req["user"];
    const { password } = await req.json();
    const foundUser = await db.User.findOne({
        where: {
            username: user.username
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
    const newPassword = await hashPassword(password);
    await foundUser.update({ hash: newPassword });
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
}
)
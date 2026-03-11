import type { AuthRequest } from "../middleware/auth";
import type { NextFunction, Request, Response } from "express";
import { User } from "../models/User";
import { clerkClient, getAuth } from "@clerk/express";
/**
 * Send the authenticated user's record from the database or an appropriate error response.
 *
 * If a user matching `req.userId` exists, responds with HTTP 200 and the user document.
 * If no matching user is found, responds with HTTP 404 and `{ message: "User not found" }`.
 * On unexpected errors, sets the response status to 500 and calls `next()` to continue error handling.
 *
 * @param req - Authenticated request; must include `userId` identifying the user to fetch
 */
export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
    try{
        const userId = req.userId;

        const user = await User.findById(userId);
        if(!user){
            res.status(404).json({ message: "User not found"});
            return;
        }
        
        res.status(200).json(user)
    }
        catch(error){
            res.status(500)
            next();
    }
}

/**
 * Ensures a local User exists for the authenticated Clerk user and responds with that user.
 *
 * If no Clerk authentication is present, responds with HTTP 401 Unauthorized.
 *
 * @returns The local User document that was found or created, serialized as JSON.
 */
export async function authCallBack(req: Request, res: Response, next: NextFunction) {
    try{
        const { userId:clerkId } = getAuth(req);

        if(!clerkId){
            res.status(401).json({ message: "Unauthorized"});
            return;
        }
            let user = await User.findOne({clerkId});
            if(!user){
                const clerkUser = await clerkClient.users.getUser(clerkId);
                
                user = await User.create({
                    clerkId,
                    name: clerkUser.firstName ? `$(clerkUser.firstName) ${clerkUser.lastName || ""}`.trim()
                    : clerkUser.emailAddresses[0]?.emailAddress.split("@")[0],
                    email: clerkUser.emailAddresses[0]?.emailAddress,
                    avatar: clerkUser.imageUrl
                });
            }
            res.json(user)
        }catch(error){
            res.status(500)
            next(error);
    }
}
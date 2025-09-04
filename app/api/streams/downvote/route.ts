import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string(),
})



export async function POST(req : NextRequest){
    const session = await getServerSession();
  
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    })
      if(!session?.user?.email){
         return NextResponse.json({
            message: "not authenticated"
        },
        {status: 400});

    }
    
    try{
        const data = UpvoteSchema.parse(await req.json());
        await prismaClient.upvote.delete({
            where: {
                 userId_streamId:{
                     userId: user?.id??"",
                    streamId: data.streamId,
                    }
           
            }
        });
    }
        catch(err){
            return NextResponse.json({
                message: "allready upvoted"
            },
            {status: 400})

        }


    const data = UpvoteSchema.parse(await req.json());
}
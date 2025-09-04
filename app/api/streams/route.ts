import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
//@ts-ignore
import youtubesearchapi from "youtube-search-api";

var YT_REGEX = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;



const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
})

export async function POST(req:NextRequest){
    try{
        const data = CreateStreamSchema.parse(await req.json());
        const isYT = data.url.match(YT_REGEX);
        if(!isYT){
            return new NextResponse("Invalid YouTube URL", {status: 411});
        }
        const extractedId = data.url.split("v=")[1];
        
        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        const thumbnails = res.thumbnail.thumbnails;
        thumbnails.sort((a:{width:number},b:{width:number})=>a.width < b.width ? 1 : -1);


       const stream = await prismaClient.stream.create({
            data: {
               userId:data.creatorId,
                url : data.url,
                extractedId,
                type: "Youtube",
                title: res.title ?? "cant find video",
                smallImage: (thumbnails.length>1 ? thumbnails[thumbnails.length-2].url : thumbnails[thumbnails-1].url) ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr4O4x65R3HTV4G5uSKGquObKJCCkydd5xJg&s",
                bigImage: thumbnails[thumbnails.length-1].url ?? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr4O4x65R3HTV4G5uSKGquObKJCCkydd5xJg&s"

            }
        })
        return NextResponse.json({message: "Stream created",
            id : stream.id
        });
    }
    catch(err){
        return new NextResponse("Invalid request body", {status: 400});
    }
}

export async function GET(req:NextRequest){
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.user.findMany({ 
        where: {
            id : creatorId ?? ""
        }
    })
    return NextResponse.json({
        streams
    });
}
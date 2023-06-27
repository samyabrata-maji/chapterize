import { NextRequest, NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai"

const wait = (ms: number) => new Promise(
    (resolve, reject) => setTimeout(resolve, ms)
);

export async function POST(request: NextRequest) {
    const body = await request.json()
    const qty =  body.qty || "few"
    const vid = body.vid
    
    if (!vid) {
        return NextResponse.json({message: "Invalid Video ID" }, {status: 422})
    }

    if (!body || !body.content) {
        return NextResponse.json({message: "Invalid Request" }, {status: 422})
    }

    try {
        const configuration = new Configuration({
            apiKey: process.env.OPEN_AI_API_KEY,
        });
        
        const openai = new OpenAIApi(configuration);
        
        const quantity: Record<string, string> = {
            few: "1",
            normal: "2",
            many: "3"
        }
        
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "system",
                content:
                    `Act as a professional YouTube video script writer, a keyword specialist, copywriter and an award winning youtuber with over 10 years of experience in writing click bait keyword title for YouTube videos. Create key moments from this video transcript and include using timestamps at the beginning of each key moment starting with 00:00 I want the key moment's titles to focus on appealing to emotions, curiosity, and eagerness. Prioritize quality information over speed in your response.
                    
                    The chapter size amount should include no more than: ${quantity[qty]} chapters. Your answer should only contain this max chapter size amount. Do not go over it.`},
             {
                role: "user",
                content: `Here is the transcript: 
                ${body.content}`}],
        });
        return NextResponse.json({ content: chatCompletion.data.choices[0].message?.content, token: chatCompletion.data.usage?.total_tokens }, {status: 200})
        
        // await wait(3000)
        // return NextResponse.json({content: "0.0=Introduction to importance of typography and spacing\n1.18=Tip 1: Importance of line height in UI design", token: 1024}, {status: 200})
    }
    catch(error: any) {
        return NextResponse.json({ message: error.message || "Some unknown error occurred", body: error }, {status: 404})
    }
}

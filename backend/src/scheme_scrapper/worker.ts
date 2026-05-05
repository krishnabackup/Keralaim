import puppeteer, { Page } from "puppeteer";
import { SchemeModel } from "../models/Schemas"
import { scrapDetailsOfEachScheme } from "./scrapDetailsOfEachScheme";

const CONCURANCY = 2;

export const runWorker = async () => {
    let i = 0;
    const browser =await  puppeteer.launch({headless : true});

    const pages = await Promise.all(
        Array.from({length : CONCURANCY}, async () => {
            const page = await browser.newPage();
            await page.setRequestInterception(true);
            page.on("request",(req)=>{
                const type = req.resourceType();
                if(["image","stylesheet","font"].includes(type)){
                    req.abort();
                }
                else{
                    req.continue();
                }
            });
            return page;
        })
    );

    while(i<9){
       const schemes = await SchemeModel.find({'schemeDetails.eligibility.plainText':'',aiFailed:true}).limit(CONCURANCY);
    if(!schemes.length) {
        console.log("All done");
        break;
    }
    await Promise.all(
        schemes.map(async (scheme,index) => {
            const page = pages[index % CONCURANCY] as Page;
            console.log("Scrapping :",scheme.slug);
            try {
        const data = await scrapDetailsOfEachScheme(page,`https://www.myscheme.gov.in/schemes/${scheme.slug}`);
        
        await SchemeModel.updateOne({
            slug : scheme.slug
        },
        {
            $set : {
                schemeDetails : data,
                isScraped : true,
                scrapedAt : new Date(),
            }
        }
    );
    console.log("Done :",scheme.slug);
    }
    catch(error){
        console.log("Failed :",scheme.slug);
        console.error(error);
    }
        })
    )
    }
   await browser.close();
}
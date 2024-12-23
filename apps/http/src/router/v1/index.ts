import { Request, Response, Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { SigninSchema, SignupSchema } from "../../types";
import client from "@repo/db/client" ;
import bcrypt from "bcrypt" ;

export const router = Router() ;

router.post('/signup',async(req:Request,res:Response)=>{
    const parsedData = SignupSchema.safeParse(req.body) ;
    if(!parsedData.success){
        res.status(404).json({message:"Validation failed"}) ;
        return ;
    }

    const hashedPassword = await bcrypt.hash(parsedData.data.password,10) ;
    try {
        const user = await client.user.create({
            data:{
                username:parsedData.data.username,
                password:hashedPassword,
                role:parsedData.data.type==="admin"?"Admin":"User"
            }
        })

        res.status(200).json({
            userId:user.id,
            message:"You have successfully created your account"
        })
    } catch (error) {
        res.status(404).json({message:"Username already exixts"})
    }
})

router.post("/signin",async(req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body) ;
    if(!parsedData.success){
        res.send(403).json({
            message:"Validation Failed"
        })
    }

    try{
        // const user = await client.user.findUnique({
        //     where:{
        //         username:parsedData.data.username
        //     }
        // })
    }catch(e){

    }
})

router.get("/elements",(req,res)=>{

})

router.get("/avatars",(req,res)=>{
    
})

router.use("/user",userRouter) ;
router.use("/space",spaceRouter) ;
router.use("/admin" ,adminRouter) ;
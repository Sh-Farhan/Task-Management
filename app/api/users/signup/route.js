import {connect} from '@/dbConfig/dbConfig'
import User from '@/models/userModel'
import {NextRequest, NextResponse} from 'next/server'
import bcrypt from 'bcryptjs/dist/bcrypt'   

connect()

export async function POST(req){
    try {
        const reqBody = req.json();
        const {username,email,password} = reqBody;
        // validation
        console.log(reqBody);

        const user = await User.findOne({email})

        if(user) {return NextRequest.json({error: "User already exists!"},{status: 400})}

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })

        const savedUser = await newUser.save()
        console.log(savedUser)


    } catch (error) {
        return NextResponse.json({error: error.message},
            {status: 500}
        )
    }
}
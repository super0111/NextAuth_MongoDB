// import { MongoClient } from 'mongodb';
import dbConnect from '../../../mongo/dbConnect';
import { hash } from 'bcryptjs';
import User from '../../../mongo/models/user';


async function handler(req, res) {

    const { method } = req;
    await dbConnect();
    
    //Only POST mothod is accepted
    if (method === 'POST') {
        //Getting email and password from body
        const { email, password, fName, lName  } = req.body;
        console.log(email + ' is trying to Sign Up')
        //Validate
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Invalid Data' });
            console.log('Invalid Credentials')
            return;
        }

        //Send error response if duplicate user is found
        const checkExisting = await User.findOne({email: email});
        if (checkExisting) {
           return res.status(422).json({ message: 'Email already exists' });
            // client.close();
        }

        const hashedPass = await hash(password, 12)
        const status = new User ({
            email: email,
            password: hashedPass,
            fName:fName,
            lName: lName,
            stripeId: '',
            since: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') ,  // replace T with a space
            userType: 2  //Default to Staff
        })
        .save(function(err){
            if(err) console.log(err);
        })

        //Send success response
        res.status(201).json({ message: 'User created', ...status });
      
    } else {
        //Response for other than POST method
        res.status(500).json({ message: 'Route not valid' });
    }
}

export default handler;

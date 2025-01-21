# Professional project
- [Model Design](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)
## Set up
- npm init
- git init
- git add .
- git commit -m ""
- git branch -M main
- git remote 
- git push -u origin main
- to store the images we use third-party service (AWS, Azure, cloudinary), we let the user upload his images/videos and we store them temporarily in our servers, in case of connection loss, then we upload these images/videos into the cloud
- create folder public/temp (folder temp not trackable as git only tracks files)
- so we create an empty file .gitkeep to keep track of folder temp
- create .gitignore file
- add .gitignore geneator for nodejs in .gitignore
- create .env
- folder src
- create file app.js, constants.js index.js with touch equivalent in windows command prompt
```bash
type nul > app.js
```

- use import syntax instead of require syntax, js imports in two type of ways a. from commonjs b. from module
- we use module for this project, for this add type in package.json
```json
  "description": "backend project for a video streaming complex project",
  "type": "module",
```
- when we make changes in server file we have to start and stop the server every time, we use nodemon utility for this, server restarts whenever the files are saved.
- install dev dependancy of nodemon
```bash
npm i -D nodemon
```
- add dev script to reload in package.json
```json
  "scripts": {
    "dev": "nodemon src/index.js"
  },
```
- dotenv package install, to use variables in .env files in the modules mentioned as type in package.json
- when using the dotenv package we always use the require syntax instaed of import syntax, we resolve this below
- in src folder we make new folders
    - controllers : for functionalities
    - db : how to connect to database
    - middlewares : code that run in-between, request to the server -> check on the request before request goes to the server, check goes in middleware like cookies
    - models 
    - routes : standard approaches
    - utils: many utilities needed like file upload, mailing(repeated functionality, needed in different places within the project)
    "mkdir controllers db middlewares routes utils" in command prompt
```bash
md controllers db middlewares routes utils
```
- install and set up prettier package to have the dev contributors on the same page
- install teh dev dependancy with
```bash
npm i -D prettier
```
- add manual files for prettier package to work named ".prettierrc", for its configurations
```js
{
    "singleQuote": false,
    "bracketSpacing": true,
    "tabWidth": 2,
    "trailingComma": "es5",
    "semi": true
}
```
- manual file named ".prettierignore"
```js
/.vscode
/node_modules
./dist

*.env
.env
.env*
```

## Database connection
- mongodb
- mongodb atlas subservice
- create cluster in new project youtube
- network connection ip address 0.0.0.0/0 caution not for actual service
- create user named jyotshna for database with role as read and write
- add PORT and MONGODB_URI in .env file
- add below code in constants.js
```js
export const DB_NAME = "videotube"
```
- Two ways for db connection
  - since index.js gets executed with nodemon, we keep the function with the db connection code into the index.js
  - create a file in a folder named db , then import that function with db connection into the index.js file(modular code better approach)
- app.js through express
- db connection through mongoose
- install packages
```bash
npm i mongoose express dotenv
```
1. When doing database connection wrap it in try catch or in promises, as there are chances that it will give error
2. Database is always in another continent, codebase can and will be stored in anywhere across the world. Loading takes time so always use async await.

- DB connection using iify(immediately executing function)

- code for 1st approach
```js
import mongoose from "mongoose"
import { DB_NAME } from "./constants"

import express from "express"
const app = express()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("errror", (error) => {
            console.log("ERRR: ", error);
            throw error
        })

        app.listen(process.env.PORT, () => {
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.error("ERROR: ", error)
        throw error
    }
})()
```

- code for 2nd approach
- node gives access of the process
- add below code in db/index.js
```js
import mongoose from "mongoose";
import { DB_NAME } from "../constants";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MONGODB connection error: ", error);
        process.exit(1)
    }
}

export default connectDB
```
- add below code in open index.js(This works but shows inconsistency in code)
```js
require('dotenv').config({path: './env'})
import connectDB from "./db"

connectDB()
```
- TO resolve this inconsistency we use and using experimental feature to load environment variable using dotenv in package.json
```js
import dotenv from "dotenv"
import connectDB from "./db"

dotenv.config({
    path: './env'
})

connectDB()
```
```json
  "scripts": {
    "dev": "nodemon -r dotenv/config --experimental-json-modules src/index.js"
  }
```
- now to run the app, we got some error (while importing connectDB in open index.js, it is not able to implement db/index.js file's connectDB function , so we add `import connectDB from "./db/index.js"` in open index.js) => here putting .js ext is very important to resolve this issue 
```bash 
npm run dev
```
- needed to get newer version of node for the script to run successfully, add below code in paackage.json instead of above code that one doesn't run the app successfully
```json
"script": {
  "dev": "nodemon --env-file=.env src/index.js"
}
```
## Custom api response , error handling
- we bring back the express by adding the below code in app.js
```js
import express from "express"

const app = express()

export {app}
```
- since the db/index.js is sending connectDB in async it also sends a promise, to handle that promise we use then(success db connect) and catch( handle error) into the open index.js file
```js
//require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js"

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.on("errror", (error) => {// to listen errors we use app.on
        console.log("ERRR:", error);
        throw error
    })
    app.listen(process.env.PORT || 8000, () => { //app starts with app.listen
        console.log(` Server is running at port : ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO db connection failed!! ", err);
})
```
- cors, cookie-parser settings for cross origin resource sharing using app.use
- NOTE: whenever middlewares are used most of the time they are used through app.use
- app.use for middleware or configuration settings
- in express api refernce page [Express api ref 5x](https://expressjs.com/en/5x/api.html#req)
- we mostly check request or response section 
- cookie-parser middleware use
- npm i cookie-parser cors
- adding below code for .env
```
PORT=8000
MONGODB_URI=mongodb+srv://jyotshna:<password>@cluster0.86zjk.mongodb.net
CORS_ORIGIN=*
```
- add cors settings in app.js
```js
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

export {app}
```
- before cookie options we make some settings for getting data for different places in backend, from url, json, from request body, forms add LIMIT of how much data the server can accept
- complicated as url has its own encoder 
- earlier express couldn't accept the json files easily, instead you had to use body-parser so the express can accept the json files, Now work of body-parser is already in express
- multer used for file uploading configuration
- getting data from filling a form
```js
const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
```
- getting data from url: to let express know that data analso come from url , to let it understand the endcoding we use express.urlencoded
```js
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
```
- to store data like pdf files, images etc onto my server we create an asset folder name public for that, we use express.static("public")
```js
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
```
- cookie-parser is for setting and accessing the cookies on user's browser from my server, basically performing crud operations on user's cookies
- There are ways so that we can store secure cookies on user's browser, these cookies can only be read or removed by server used in production grade apps
```js
app.use(express.static("public"))
app.use(cookieParser())
```
- middlewares![alt text](<Screenshot 2025-01-10 223932.png>)
- in Database connect in db/index.js since data fron db takes time to load  we need async await and try catch for error handling
- since we will be request for db data repeatedly for user controller, video controller and etc, so we can make it into a utility(generalized function) that can be made once and used repeatedly instead of writting the whole code again and again.
- write below code in util/asyncHandler.js
```js
//asyncHandler promises type
const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

export {asyncHandler}

//asyncHandler try-catch type => higher order function that treats other fn as variable(as param or return fn)
/*
const asyncHandler = (requestHandler) => async (req, res, next) => {
    try {
        await requestHandler(req, res, next)
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
}
*/
```
- To standardize the sending of error codes and api response (json) [nodejs api error](https://nodejs.org/api/errors.html)
- i want to overwrite some of the error classes so that i have some control over sending errors
- add below code in src/utils/ApiError.js and things in this.data is [Node js error data structure](https://nodejs.org/api/errors.html#error-propagation-and-interception)
```js
class ApiError extends Error{
    constructor(
        statusCode, 
        message="Something went wrong",
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false // as we are handling errors instead of response
        this.errors = errors

        if (stack) {
            this.stack = stack
        } else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}
```
- since node traces the errors and not request-response its becuase of express that is used(as we are not working with core nodejs instead with nodejs + express)
- still to make ApiResponse.js to see how it is made in src/util/ApiResponse.js
```js
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
```
- whenever an error comes it needs to go through ApiError everytime, to do this we need to make a middleware

## User and video model w hooks aand JWT
- make a folder named models in src folder, Create a file named user.model.js, video.model.js
- mongodb stores data in bson(used for storing data, binary) and generates a unique id for every entry,(json used for data exchanges between systems, text)
- In user model, we will use thrid-party serice(cloudinary) for avatar and coverImage to get a url as string to be stored in the database
- In video model, we will use that same third-party service for videoFile and thumbnail.
- to make a field optimised searchable make into index : true in any database especially in mongodb
- to encrypt the password before storing in database
- password
- token
- add below code in user.model.js
```js
import mongoose, {Schema} from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String //cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Passord is required"]
        },
        refreshToken: {
            type: String
        }
    }, {timestamps: true}
)

export const User = mongoose.model("User", userSchema)
```
- add below code in video.model.js
```js
import mongoose, {Schema} from "mongoose";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true,

        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        }
    }, {timestamps: true}
)

export const Video = mongoose.model("Video", videoSchema)
```
- Since the projects get complecated with the attribute watchHistory we use a package named "mongoose-aggregate-paginate-v2" allows us to use aggregation queries, in mongoose we do the insert many, update many
- Many more learning from [mongodb aggregation pipeline ](https://www.mongodb.com/docs/manual/core/aggregation-pipeline/)
- "npm i mongoose-aggregate-paginate-v2" on terminal
- for middleware mongoose gives a lot [things](https://mongoosejs.com/docs/middleware.html) and videoSchema.plugin that i can use to add my own plugins, here i can use the mongooseAggregationPaginate for aggregation queries
- this aggregation pipeline makes te project so complex
- use it in src/models/video.model.js
```js
import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String, //cloudinary url
            required: true
        },
        thumbnail: {
            type: String, //cloudinary url
            required: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        title: {
            type: String,
            required: true,

        },
        description: {
            type: String,
            required: true,
        },
        duration: {
            type: Number,
            required: true
        },
        views: {
            type: Number,
            default: 0
        },
        isPublished: {
            type: Boolean,
            default: true
        }
    }, {timestamps: true}
)
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video", videoSchema)
```
- use bcryptjs and jsonwebtoken npm packages for encrypting and hashing the password attribute in user.model.js
- npm i bcrypt jsonwebtoken
- import both into user.model.js
- we can't do direct encryption so we use some mongoose middleware hooks names pre => just before saving the data(before middleware calls next), this hook(fn with some code) can be used just before it
- Like ecrypting the password in the pre hook 
- It is used just like the plugin hook in video.model.js 
- the hook uses the events mentioned in [moongoose Middleware](https://mongoosejs.com/docs/middleware.html)
- Events
    - validate
    - save
    - updateOne
    - deleteOne
    - init (note: init hooks are synchronous)
- Not using the callback fn as arrow fn becuase arrow fn does not know about the context meaning it doesn't know about the reference of "this"
- here knowing context is very important as we have to know which user we are dealing with for "save" event/method.
- Since encryption function takes time to encrypt we use async 
- Middleware needs next flag, work done so at the end we call the next flag
- in src/models/user.model.js
```js
userSchema.pre("save", async function(next) {
    this.password = bcrypt.hash(this.password, 10)
    next()
})

export const User = mongoose.model("User", userSchema)
```
- Here an issue is introduced, whenever a user saves after updating some field the password always change
- What to do: only change password when a password modification is sent, then only this code should be run. Use cases: new password, update password
- Solution : 
```js
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next

    this.password = bcrypt.hash(this.password, 10)
    next()
})

export const User = mongoose.model("User", userSchema)
```
- bcrypt does a lot of behind-the-scenes things, we need to use some methods to check from the user that the password is correct or not, for that mongoose provides the methods to be injected, like updateOne, deleteOne
- I can design some customs methods to work with too
- userSchema has an object named "methods"
- bscrypt can hash the pasword and check the password too with fn compare.
- since encryption takes time we use await
```js
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

export const User = mongoose.model("User", userSchema)
```

- Working with jwt bearer token => Asked in Interviews
- Bearer token meaning that whoever bears it accepts it as valid i.e whoever has this token/ whoever sends this token to me, I will send them the data, Like a key, so do not lose the key and use it carefully
- This token provides strong security
- JWT needs some variables to provide these token.
- These ACCESS_TOKEN_SECRET are mainly found in ".env" file that will be used in jwt tokens
- In production grade packages these secret strings are generated complexly, they can be generated with algos like sha 256, random and many more
- ACCESS_TOKEN_EXPIRY=1d
- REFRESH_TOKEN_SECRET
- REFRESH_TOKEN_EXPIRY=10d
- Since we are using both sessions and cookies, so access token will not be stored in the database but the refresh token WILL be stored
- Now we can generate the access token and refresh token within the user.model.js:
```js
import mongoose, {Schema} from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true
        },
        coverImage: {
            type: String //cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, "Passord is required"]
        },
        refreshToken: {
            type: String
        }
    }, {timestamps: true}
)

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next

    this.password = bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
```

## File upload in backend
- fronted does not have access to do the file upload, it cn only do : making a form, can browse a file and can give you its link while submitting thats it.
- The tech stack that we are using like express does not have direct file uploading capabilities
- Most of the file handling is not done on in-house servers, especially in today's production grade things
- For that, either a third-party service is used or AWS upload.
- How to handle it is a professional thing, files may not come in every endpoint, it may come in register, not in login.
- Making it a utility is better for reusing it. And can be used as middleware.
- Cloudinary , express-fileupload npm package, multer and express-fileupload is almost same
- npm i cloudinary
- npm i multer
- user will upload a file through multer on cloudinary
- we take the file from user through multer(middleware for file access) and put it our local server temporarily, for the next step, we take that file from the local server and upload it on the server using cloudinary(function call)
- Why the need to two steps? we can directly upload file to the server through multer using cloudinary
    - Yes we can but it is better in case of reattempting the steps if the file is first uploaded on local server.
- write the code in src/utils/couldinary.js , file name also be fileupload.js and this code is REUSEABLE
- after uploading file on the server a file path is given to us of the file that is on the server to put it on cloudinary
- after successfully uploading the file on the cloudinary, the file will be removed from the server as it is now not needed
- file open, read, sync, remove using fs package in nodejs it needs file path
- link is removed w/o affecting the file or directory[about it](https://nodejs.org/api/fs.html#fspromisesunlinkpath) to reomve the file from the server
- take the configurationn from cloudinary console and add the api_secret in .env file after
- configuration gives the permission for file upload
- refresh_token
```
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```
- add configure in src/utils/couldinary.js and make a method that takes path of file as a parameter and if successfully uploaded it will unlink the file
```js
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });   
})();

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("File is uploaded on cloudinary", response.url)
        return response;
    } catch (error) {
        
    }
}
```
- file not uploaded successfully or try code mistake for catch
- If anyone is using cloudinary means that at least the file is on the server, since it has not been uploaded so there is an issue somewhere
- So for a safe cleaning purpose , that file should be removed from the server , if not many corrupted/ malicious files will remain of the server.
- using the fs.unlink in the catch in src/utils/cloudinary.js
```js
import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });   
})();

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfully
        console.log("File is uploaded on cloudinary", response.url)
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file as the upload operation got failed
        return null
    }
}

export {uploadOnCloudinary}
```
- The code can be debugged when we actually register the first model of user
- Now we will write controllers since models are ready, we will write register, login, logout, file uploading.
- Work on CLOUDINARY is done
- Now we will write some middlewares using multer (writing them directly is still is an option)
- wherever we will need file upload capabilities , I will inject multer there.
- Cloudinary is like a utility 
- Now We will need to configure middleware  and how to write basic multer functionality.
- create a file src/middlewares/multer.middleware.js
- [Multer use guide](https://github.com/expressjs/multer), Use DiskStorage in multer
- req : we configured the request as json in express, file : multer is used when it has file for implementing a usage of file, cb : callback
```js
import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")  //cb callback & path to destination where to keep all the files
    },
    filename: function (req, file, cb) { // unique filename for pro project
    //   const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    //   cb(null, file.fieldname + '-' + uniqueSuffix)
        cb(null, file.originalname)
    }
  })
  
export  const upload = multer({ 
    storage: storage // or just writing storage once also works 
})
```
- storage method made to be used as middleware

## HTTP crash course
- Sending data in plain text
- Transfer in an optimized way so that data structure is not used which is very expensive(DSA knowledge)
- Transfering work on network, computer having OS(networking role)
- OS will stored and use that data (OS knowledge used)
- One server(mobile app/ client) to other server(server)
- url, uri, urn

- What are HTTP headers
    - metadata : key-value pairs, header are sent along with request & response
    - what headers do? Used for Caching, Authentication(bearer token, session token, cookies, session values), manage state(guest user, logged in user, user state)
    - x prefix(deprecated) in 2012 for every header
    - No official header category but to understand header better 
        1. Request Headers - from Client data
        2. Response Headers - from Server data
        3. Representation Headers - encoding/ compression(graph chart zerodha razorpay)
        4. Payload Headers - data
    - Most COMMON headers
        - Accept : application/ json
        - User-Agent : postman, browser name/ engine name(suggest mobile app based on this info)
        - Authorization : commonly used in front-end , bearer___jwt token___
        - Content-type : image, pdf
        - Cookie : object, unique code, time user logged in
        - Cache-control : data expire after 3600 secs
    - Headers in production grade apps:
        - CORS:
            - Access-Control-Allow-Origin
            - Access-Control-Allow-Credentials
            - Access-Control-Allow-Method
        - Security:
            - Cross-Origin-Embedder-Policy
            - Cross-Origin-Opener-Policy
            - Content-Security-Policy
            - X-XSS-Protection
    
    - HTTP methods: Basic set of operations that can be used to interact with server
        - GET : retrieve a resource
        - HEAD : No message body (response headers only)
        - OPTIONS : what operations are available at this endpoint
        - TRACE : loopback test (get some data), determine route request through proxies
        - DELETE : remove a resource
        - PUT : replace a resource
        - POST : interact with resource(motly add)
        - PATCH : change part of a resource
        - etc
    - HTTP Status Code
        - 1xx : Informational
        - 2xx : Success
        - 3xx : Redirection
        - 4xx : Client error
        - 5xx : Server error
    ```text
        100 Continue
        101 Switching Protocols
        102 Processing
        200 Ok
        201 Created
        202 Accepted
        203 Non-Authoritative Information
        204 No Content
        307 Temporiry redirect
        308 Permanent redirect
        400 Bad request
        401 Unauthorized
        402 Payment required
        404 Not Found
        500 Internal Server Error
        504 Gateway timeout
    ```

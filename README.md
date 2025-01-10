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
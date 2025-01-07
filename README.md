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
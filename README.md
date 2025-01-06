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

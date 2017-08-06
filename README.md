# cap

## Prerequisites 

First make sur you have a fully working node environement (install nodejs and make sure you updated your PATH)

Install dependencies : `npm install`

## Run the dev environement

npm start

## To build "production" bundle

- Remove the line `render();` in main.js ... ehm
- run `NODE_ENV=production npm run build`
- copy the file dist/main.js to js/cartoapp.js in the site source code

# Flight Milage Calculator

## About the project

Requirements:

* Autocomplete airports during search
* Include US airports only
* (Stretch) plot trip on a map

## Viewing this project

This project contains a `dist` directory, which contains a production ready build of the app.  Simply cd into that directory, and run an http server from that directory (for instance, `python -m SimpleHTTPServer 8080` on a mac).  Then direct your browser to `localhost:8080`.

## Project structure

In order to read the code for this project, navigate to `src/components/Calculator.vue`.  This file contains the structure, view logic & styles for the app.  Additional service code can be found in `src/js/`.  `src/App.vue` shows how `Calculator.vue` is imported, and `index.html` provides a foundation for the App.

## Developing locally

In order to run this project in a dev environment, run the following commands:

```
cd into project directory
npm run install-prereq // install vue-cli globally, npm install
npm run dev // Will serve project at localhost:9898
```

## Built with Vue.js

Vue is getting a lot of attention right now, and I haven't made much time to look into it.  This project was a great opportunity to take a quick look.

Initially, I used the `vue-cli` and a default webpack project template to scaffold the project quickly.  I eventually decided to fork their webpack template, and update it to include sass out of the box, as well as slightly less verbose sample code.  

The resulting template is available for use with `vue-cli` [here](https://github.com/adamvanlente/sass-webpack-vue-template).

## About the data

Checkout out the README in the `data-work` directory.

# sebamaster-movie-frontend application
Movies example application based on AngularJS. Backend can be found [here](https://bitbucket.org/sebischair/sebamaster-movie-backend/overview)

## Prerequisites

Both for the front end and the back end check:

* nodejs [official website](https://nodejs.org/en/) - nodejs includes [npm](https://www.npmjs.com/) (node package manager)

mmmm
Just for the front end application

* bower [official website](http://bower.io/) - frontend dependencies package manager
* gulp [official website](http://gulpjs.com/) - javasript task runner
* sass [official website](http://sass-lang.com/) - css preprocessor (you don't need to install sass, since it's already there as npm dependency on the project)


## Setup (before first run)

* install npm and bower dependencies `npm install`

## Running

* go to your project folder `cd to/your/folder`
* execute gulp tasks (and keep watching for further changes) `gulp watch`
* optional: start built in web server `node node_modules/.bin/http-server` (you can also run the project using your own installation of e.g. XAMPP on windows or even locally). The root folder will be public/

## Directory structure

and important files

```
app/                //your app
-- ng/              // your angular app (js-files and html-templates)
---- components/    // your components (services, directives etc.)
---- views/         // your views. each view folder has it's own url
-- sass/            // all scss files and libraries
---- screen.scss    // your main scss file. this sould be the only non-partial file
bower_components/   // bower components
node_modules/       // npm modules
public/             // this is the root of your (public) website. Do not put stuff there that is not intended for the client
-- index.html       // entry point of the application. **There's only one html page in your application**
-- js/              // your js files
---- app.js         // your (eventually minified and sourcemapped) angular app. Created from the files in your app/ directory by gulp
---- templates.js   // your angular templates. Created by gulp
-- cs/              // css files. created from your sass sources
-- img/             // images
-- libs/            // third party libs
----libs.js         // all javascript libs (eventually minified)
gulpfile.js         // gulp task specifications
package.json        // npm dependencies information (this belongs into source control)
bower.json          // bower dependencies information (this belongs into source control)
```
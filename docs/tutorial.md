# Tutorial

In this tutorial, we are building both the backend(API) and the frontend(APP) of the application. The APP will be made using Angular and the backend using Node.

## Creating the APP
### Creating your Angular project
#### 1. Installing Angular
Assuming you’ve already installed NodeJS, you need to install Angular so you can create the project.
```
npm install -g @angular/cli
```
#### 2. Creating the project
Once Angular is installed on your computer let's create the project!
```
ng new emojifier
```
Please make sure to answer the questions with the defined answers:
```
1. question: Would you like to add Angular routing?
   answer: y

2. question: Which stylesheet format would you like to use?
   answer: CSS
```
Now you should have your angular base project!

#### 3. Updating the first page

Update your `src/app/app.component.html` so it matches the following content:

```html
<!--The content below is only a placeholder and can be replaced.-->
<style>
@font-face {
  font-family: 'Futura Thin';
  font-style: normal;
  font-weight: normal;
  src: url("/assets/fonts/FUTURTHN.ttf") format("ttf"), url("/assets/fonts/FUTURTHN.woff") format("woff");
}

@font-face {
  font-family: 'Hack';
  font-style: normal;
  font-weight: normal;
  src: url("/assets/fonts/Hack-Regular.ttf") format("ttf"), url("/assets/fonts/Hack-Regular.woff") format("woff");
}

button:hover {
  color: #0063B1 !important;
  cursor: pointer;
}

</style>
<div style="text-align:center">
  <img width="150" alt="MLH Logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Major_League_Hacking_logo.svg/1200px-Major_League_Hacking_logo.svg.png">
  <h2 style="font-family: 'Hack', sans-serif; font-weight: Bold; color: #333; margin: 4vh 2vw; padding: 0; font-size: 8vh;">
     WELCOME TO {{ title | uppercase}}!
  </h2>
</div>

<div style="display:flex; align-items: center; justify-content:center; flex-direction:column; padding:50px 0">
  <div style="font: 46px 'Futura Thin', sans-serif; background-color: white; color: black; width: 90vw; margin: 0 auto;  text-align: center;">
    <span>
      Past an image link and see the Emojifier magic!
    </span>
    <br />
    <input style="min-width: 375px; height: 5vh; margin: 2vh 0; font-size: 24px; font-family: 'Hack';" #imageUrlInput>
    <button (click)="sendFile(imageUrlInput.value)" style="font-family: 'Hack';color: white; border: 1px solid #ccc; background-color: #162f51;  font-size: 24px; width: 200px; height: 6vh; margin: 2vh 0; outline: none; border-radius: 4px;"> Emojify! </button>
  </div>
</div>

<div style="display: flex; justify-content: center">
  <div style="position: relative">
    <img src="{{ imageUrl }}" *ngIf="!!imageUrl"/>
    <div [innerHtml]="htmlToAdd | safe:'html'"></div>
  </div>
</div>

<router-outlet></router-outlet>
```
#### 4. Communicating with the API
To get the information from Microsoft you need to communicate with the API. Update your `src/app/app.component.ts` so it matches:

```js
import { Component, Pipe } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl} from '@angular/platform-browser';

@Pipe({ name: 'safe' })
export class SafePipe {
    constructor(protected _sanitizer: DomSanitizer) {}
    public transform(value: string): SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
    constructor(private http: HttpClient) {}

  title = 'emojifier';
  uri = 'http://localhost:3000';
    imageUrl = '';
    htmlToAdd = ''

    sendFile(imageUrl) {
    this.imageUrl = '';

    const obj = {
      imageUrl: imageUrl,
    };

        type FaceModel = {
            faceRectangle: {
                height: number,
                width: number,
                left: number,
                top: number,
            },
            faceAttributes: {
                emotion: object,
            }
        };

        this.htmlToAdd = ''
        this.http.post(`${this.uri}`, obj).subscribe((res:any) => {
      if (res.error) {
        this.htmlToAdd += `<span style="color: red;">${res.error.message}</span>`;
        return;
      }
            res.forEach((face:FaceModel) => {
                const { faceRectangle, faceAttributes } = face;
                const { height, width, left, top } = faceRectangle;
                const style = `position:absolute; height:${height}px; width:${width}px; left:${left}px; top:${top}px;`
            this.imageUrl = imageUrl;

                const { emotion } = faceAttributes;
                let mainEmotion = undefined;

                Object.keys(emotion).forEach(key => {
                    if(!mainEmotion || emotion[key] > emotion[mainEmotion]) {
                        mainEmotion = key
                    }
                });

                this.htmlToAdd += `<img class='emoji' style="${style}" src="/assets/${mainEmotion}.png"/>`;
            })
        });
    }
}
```

now create a file with the following path `src/app/api.service.ts`

```js
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  uri = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  sendFile(file) {
    const obj = {
      file: file,
    };
    console.log(obj);
    this.http.post(`${this.uri}`, obj)
        .subscribe(res => console.log('Done'));
  }
}
```

And lastly, let's update the `src/app/app.module.ts`

```js
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent, SafePipe } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### 5. Adding the assets

1. get the [image files](https://drive.google.com/drive/folders/1NFTH3dbeoPdXiJ5BUwp5MhrwTaNgmMyY?usp=sharing) and place them in the `src/assets` folder
2. inside the root folder run `mkdir src/assets/fonts` and  get the [font files](https://drive.google.com/drive/folders/1klPO6c4dESFmhXi2yneyiXgkwlHIAgyv?usp=sharing) and place them in the `src/assets/fonts` folder

## Creating the API
#### 6. Installing Express
Now you need to install Express in the emojifier directory and save it in the dependencies list.
```
$ npm install express --save
```

#### 7. Creating API folder
Inside the root project folder run the commands:
```
mkdir server
cd server
```

#### 8. Creating your first endpoint
Now let's create the first endpoint, this is going to be used to receive the calls from the APP.
Inside the `server` folder create a file named `index.js` with the following content:

```js
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

#### 9. Installing concurrent
To run both API and the Angular application you need to install a library named `concurrent`

npm install --save-dev concurrently

And in your `package.json` replace the `scripts` with the content:

```json
    "ng": "ng",
    "start": "concurrently -c \"yellow.bold,green.bold\" -n \"SERVER,BUILD\" \"nodemon server\" \"ng build --watch\" \"ng serve\"",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
```

Inside the project folder run `npm start`
Now in your browser when you access `http://localhost:3000/` you will see a nice and simple `Hello World`

#### 10. Installing body-parser
To read the Emojifier request data we need to add a library called `body-parser`.
```
npm install body-parser --save
```

And update your `index.js` so it looks like this:

```js
const express = require('express')

const app = express()

app.use(express.json())

const port = 3000

app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```


#### 11. Installing cors
To allow the requests from the form to happen, we need to add a library called `cors`

```
npm install cors --save
```

And update your `index.js`:

```js
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors({
  origin: '*',
}))

const port = 3000

app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

#### 12. Adding the `API URL` and `Azure Key`

To emojify the images, we need first to discover which emoticon we should add and where, and to do it we will use [Microsoft Face API](https://azure.microsoft.com/en-us/services/cognitive-services/face/). To achieve our goal, we will need to communicate with an [api](https://www.mulesoft.com/resources/api/what-is-an-api).

Update the `server/index.js` so it looks like:

```
const express = require('express')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors({
  origin: '*',
}))

const uriBase = 'https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect';
const subscriptionKey = process.env.AZURE_KEY;

const port = 3000

app.post('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

Notice that we will be using an Azure key as an env variable.

#### 13. Installing mongodb

[MongoDB](https://docs.mongodb.com/manual/) is an open-source, document database designed for ease of development and scaling.

```
npm install mongodb --save
```

**Importing**
Done that, we need to import the mongoDB to our application, together with the other imports, add:

```
const mongodb = require('mongodb')
```

**Connection**
Now, we need to define a connection, right below of the import we'll add the connection:

```
const MongoClient = require('mongodb').MongoClient
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'emojifier';

MongoClient.connect(mongoURL, function(err, db) {
  if (err) throw err;
    console.log("Connected successfully to server");
    var dbo = db.db(dbName);
    db.close();
});
```

Obs.: Take a mongodb:// URI and the parameters host, port, database, options. By default, the mongoDB is configured on port 27017.

**Collections**
Use the createCollection method to pass to mongoDB our object

```
MongoClient.connect(mongoURL, function(err, db) {
  if (err) throw err;
    console.log("Connected successfully to server");
    var dbo = db.db(dbName);
    dbo.createCollection("faces");
    db.close();
});

```

#### 14. Setting up our final endpoint

Now, at the endpoint, we need to pass the parameters to our API service. We need to give the URL of the image we want to emojify

```
const { imageUrl } = req.body;
```

The parameter of the type of face we want

```
const params = {
    'returnFaceAttributes': 'emotion'
  };
```

And that's done, we set the options to be passed to our API service.

```
const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
  };
```

this way, our `index.js` is going to look like this:

```
const express = require('express')
const cors = require('cors')
const mongodb = require('mongodb')

const MongoClient = require('mongodb').MongoClient
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'emojifier';

const app = express()

app.use(express.json())
app.use(cors({
  origin: '*',
}))

const uriBase = 'https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect';
const subscriptionKey = process.env.AZURE_KEY;

const port = process.env.PORT || 3000

app.post('/', (req, res) => {
  const { imageUrl } = req.body;

  const params = {
    'returnFaceAttributes': 'emotion'
  };

  const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
  };
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```


#### 15. Installing request

To communicate with Microsoft's API, we need to use the `request` library.

```
npm install request --save
```

And add in the first line of our 'index.js' add the following line:

```
const express = require('express')
const cors = require('cors')
const mongodb = require('mongodb')
const request = require('request')
```

#### 16. Testing the endpoint

Now that we have the library let's communicate with the API

```
  request.post(options, (error, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);
  });
```

above we are sending our parameters to the Microsoft's API and asking for the image details, but before we finish, we have to save the response in the database
```
  request.post(options, (error, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);

    if(response.statusCode == "200"){
      MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.createCollection("faces");
        const myobjFace = { imageUrl: imageUrl, faceAttributes: JSON.stringify(body) };
        dbo.collection("faces").insertOne(myobjFace, function(err, res) {
            if (err) throw err;
            console.log("1 register inserted");
            db.close();
        });
      });
    }
  });
```

After our request is completed, our 'index.js' will be like this:

```
const express = require('express')
const cors = require('cors')
const mongodb = require('mongodb')
const request = require('request')

const MongoClient = require('mongodb').MongoClient
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'emojifier';

const app = express()

app.use(express.json())
app.use(cors({
  origin: '*',
}))

const uriBase = 'https://brazilsouth.api.cognitive.microsoft.com/face/v1.0/detect';
const subscriptionKey = process.env.AZURE_KEY;

const port = process.env.PORT || 3000

app.post('/', (req, res) => {
  const { imageUrl } = req.body;

  const params = {
    'returnFaceAttributes': 'emotion'
  };

  const options = {
    uri: uriBase,
    qs: params,
    body: '{"url": ' + '"' + imageUrl + '"}',
    headers: {
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key' : subscriptionKey
    }
  };

  request.post(options, (error, response, body) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(body);

    if(response.statusCode == "200"){
      MongoClient.connect(mongoURL, function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.createCollection("faces");
        var myobjFace = { imageUrl: imageUrl, faceAttributes: JSON.stringify(body) };
        dbo.collection("faces").insertOne(myobjFace, function(err, res) {
            if (err) throw err;
            console.log("1 register inserted");
            db.close();
        });
      });
    }
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
```

## 10. Running your application!

Now inside the project folder run `AZURE_KEY=YOUR_AZURE_KEY npm start`
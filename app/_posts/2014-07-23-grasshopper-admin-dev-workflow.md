---
layout: post
title: "Grasshopper Admin Dev Workflow"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## Project setup

```bash
git clone git@github.com:Solid-Interactive/grasshopper-admin.git
git clone git@github.com:Solid-Interactive/grasshopper-api-js.git
git clone git@github.com:Solid-Interactive/grasshopper-core-nodejs.git

# optionally - probably not
git clone git@github.com:Solid-Interactive/bridgetown-api-js.git

cd grasshopper-admin && npm install && bundle install && bower install
```

## Dev workflow

Setup ghapi.json in the ./server directory of the grasshopper-admin project. This is the config file that has the server and database info.

For an example of what this should look like, [see the grasshopper documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#projectconfiguration).


### updating admin front end alone

```bash
cd server
npm install
grunt server
```


Make sure you're on the correct branch.

https://www.npmjs.org/doc/cli/npm-link.html
https://www.npmjs.org/doc/cli/npm-uninstall.html
https://www.npmjs.org/doc/cli/npm-rm.html
(npm unlink -h)

### updating api w core stable
```bash
cd ~/workspace
git clone git@github.com:Solid-Interactive/grasshopper-api-js.git
cd grasshopper-api-js
npm install 
npm link 
cd ~/workspace/grasshopper-admin/server
npm link grasshopper-api  
grunt server
```

You can verify the link using:
 
```bash
npm list --depth=0
```
If you make changes in api you should restart the node server, no need to rebuild.
```bash
node index.js
```


### updating core
```bash
cd ~/workspace
git clone git@github.com:Solid-Interactive/grasshopper-core-nodejs.git
grasshopper-core-nodejs
npm install 
```

## Unlinking the projects


To unlink related projects, use
```bash
npm uninstall grasshopper-api
```


## Deploy workflow

Use this to deploy new version to staging evnironment.
```bash
grunt deploy
git push heroku staging:master
```

We should normally do deployments daily.

## Data

https://devcenter.heroku.com/articles/mongolab

TODO: add a grunt open to this.   
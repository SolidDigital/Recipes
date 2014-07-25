---
layout: post
title: "Grasshopper Admin Dev Workflow"
description: ""
category: 
tags: []
---
{% include JB/setup %}

## Project setup

---

First clone the grasshopper-admin project:

```bash
git clone git@github.com:Solid-Interactive/grasshopper-admin.git
```

as well as any of the npms you will be developing on:

```bash
git clone git@github.com:Solid-Interactive/grasshopper-api-js.git
git clone git@github.com:Solid-Interactive/grasshopper-core-nodejs.git
# optionally - probably not
git clone git@github.com:Solid-Interactive/bridgetown-api-js.git
```

now install the dependencies for the project:

```bash
cd grasshopper-admin
npm install && bundle install && bower install

cd server
npm install
```

&nbsp;

## Dev workflow

---

To test locally, you will be running a node app from `/server`. This app will run
an instance of grasshopper-api. The app must be configured to server the correct
data. The data served can be local or remote.

The configs are pulled from the environmental variable `GHCONFIG` if availables or
the fallback of the content of the `ghapi.json` file.

Setup ghapi.json in the `/server` directory of the grasshopper-admin project. 
This is the config file that has the server and database info for your local dev
work. It is gitignored.

For an example of what this should look like, [see the grasshopper documentation](http://solid-interactive.github.io/grasshopper-core-nodejs/documentation.html#projectconfiguration).

Once the dependencies are installed and the configs are ready, syou can start the server
from the root of the project or any subdirectory using:

```bash
grunt server
```

The workflow is slightly different depending on which part of the grasshopper ecosystem
you are working on. We'll describe the situations from simplest to most complex.

&nbsp;

### Updating only the admin front

---

If  you are only doing front end work, and can use the published grasshopper-api npm,
this is the workflow to follow.

Make sure you're on the correct branch, and then run `grunt server`.

As you change front end files, they will be copied into the server directory.

To see the changes, refresh your browser with `COMMAND-R`.

&nbsp;

### Updating api w core stable

---

If you will be doing work in grasshopper-api, then you will first have to create an
initial front end build using either `grunt build` or `grunt build-no-optimize`. This
will setup a front end you can use to test your changes.

Once the build is created, you can quickly run it from the root using, `node server`.

[Use the debugger as needed.]({{ site.JB.BASE_PATH }}/debugging-node) as needed.

You do not need to create any additional builds. You can now dev directly in your clone 
of grasshopper-api.

To have `server` use your local grasshopper-api and not the grasshopper-api pulled
from npm, you must link it.

Linking is a two step process.

First you must create a globally accessible link from the dependency project (grasshopper-api).

```bash
cd ~/workspace
git clone git@github.com:Solid-Interactive/grasshopper-api-js.git
cd grasshopper-api-js
npm install 
npm link 
```

Then you must use the globally accessible link from server.

```bash
cd ~/workspace/grasshopper-admin/server
npm link grasshopper-api  
grunt server
```

You can verify the link using:
 
```bash
npm list --depth=0
```

The documentation for linking is available at:

https://www.npmjs.org/doc/cli/npm-link.html

Once you are have finished your dev work on grasshopper-api, you should publish the npm.

At this point, to test the new npm, you should unlinkg grasshopper-api and pull the dependency in from npm:

```bash
cd ~/workspace/grasshopper-admin/server
npm uninstall grasshopper-api
npm install --save grasshopper-api@[the newly published version]
```

Documentation around removing npm dependencies is available at:

https://www.npmjs.org/doc/cli/npm-uninstall.html
https://www.npmjs.org/doc/cli/npm-rm.html
(npm unlink -h)


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
---
layout: post
title: "Debugging node"
description: ""
category: 
tags: []
---
{% include JB/setup %}


For stepping through code use `node-inspector`. To install `node-inspector`:

```bash
npm install -g node-inspector
```

To run node inspector you must use a path to the app, for example if you have an app in the `server` 
directory and it contains an `index.js` file as it's entry point:

```bash
node-debug server
```

Note that the command is `node-debug`. If, for example, you wanted to debug 
via grunt, you would need the path to grunt:

The direct method above or using a path to a js file is the easiest method. You can also try and debug
through other parent apps. In each case, the path is needed:

```bash
node-debug $(which grunt) server
```

Finally, debugging mocha seems error prone, but if you have to, you should use `_mocha` and not `mocha`:

```bash
node-debug $(which _mocha)
```



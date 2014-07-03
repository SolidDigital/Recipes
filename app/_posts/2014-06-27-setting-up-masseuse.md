---
layout: post
title: "Setting up masseuse"
description: ""
category: 
tags: []
---
{% include JB/setup %}

1. See if grunt init masseuse is installed

    ```bash
    grunt-init masseuse
    ```

2. Install grunt-init if not installed

    ```bash
    npm install -g grunt-init
    ```

3. Install masseuse template into grunt-init directory
 
    ```bash
    git clone git@github.com:Solid-Interactive/grunt-init-masseuse.git ~/.grunt-init/masseuse
    ```

4. Set up project scaffolding
    
    ```bash
    grunt-init masseuse
    ```
    
5. Install dependencies

    ```bash
    npm install && bower install
    ```
    
6. Test your install

    ```bash
    grunt server
    ```
    
7. (Optional) [Setup git repository and release branches]({{ site.JB.BASE_PATH }}/2014/06/30/setup-git-and-release-branches/)
    
8. (Optional) [Setup and deploy to Heroku]({{ site.JB.BASE_PATH }}/2014/07/01/setup-heroku-for-staging/)
---
layout: post
title: "Setting up masseuse"
description: "How to begin a masseuse project."
category: "setup"
tags: ["backbone", "masseuse", "git", "gh-pages", "deploy", "grunt-init"]
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
    
7. (Optional) [Setup git repository and release branches]({{ site.JB.BASE_PATH }}/setup-git-and-release-branches/)
    
8. (Optional) [Setup and deploy to Heroku]({{ site.JB.BASE_PATH }}/setup-heroku-for-staging/)
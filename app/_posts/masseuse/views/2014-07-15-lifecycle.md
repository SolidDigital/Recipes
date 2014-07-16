---
layout: post
title: "Lifecycle"
description: ""
category: "examples"
tags: ["masseuse", "lifecycle methods"]
---
{% include JB/setup %}

## Word, a masseuse view has a lifecycle.

After you call start on a view, the following methods are called

1. beforeRender
    * Noop by default. Views can override to customize behavior.
    * Optionally [async]({{ site.JB.BASE_PATH }}/async-render-example). 
1. render
    * Runs templating and overwrites or appends into `view.$el` depending on the value and existence of `options.appendTo` or `options.prependTo`
1. afterRender
    * Noop by default. Views can override to customize behavior. 
    * Optionally [async]({{ site.JB.BASE_PATH }}/async-render-example).
    
The following events are fired:
1. Lifecycle event fired: beforeRenderDone
1. Lifecycle event fired: renderDone
1. Lifecycle event fired: afterRenderDone

The deferred object returned by `view.start()` is notified:
1. Deferred progress : beforeRenderDone
1. Deferred progress : renderDone
1. Deferred progress : afterRenderDone

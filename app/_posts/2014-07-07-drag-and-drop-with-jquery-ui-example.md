---
layout: post
title: "Drag and drop with jQuery UI example"
description: ""
category: "examples"
tags: ["jquery ui", "drag and drop", "rivets"]
---
{% include JB/setup %}

[Sample code](http://solid-interactive.github.io/masseuse-examples/drag-and-drop)

The interesting thing about drag and drop, is that the DOM gets out of sync with Rivets.
When sorting with jquery ui, Rivets does not know about the sort. So, we sync the collection on our own. 

Jquery Ui Drag and drop provides an [update](http://api.jqueryui.com/sortable/#event-update) event when you have stopped sorting and the dom is done updating.
We use this callback to re-synchronize the dom and the collection.


When you initialize the sortable element, you can pass a callback for specific events.

```javascript
$sortable.sortable({
    update : _.debounce(_update.bind(this, $sortable), 50)
});
```

The update method iterates over the dom and resets the collection with the new order.
The collection reset needs to be silent, as we do not want rivets to re-render the dom when we reset.

```javascript
function _update($sortable) {
    var fruits = [],
        self = this;

    $sortable.find('li').each(function() {
        fruits.push(self.collection.get($(this).attr('modelid'));
    });

    this.collection.reset(fruits, {silent : true});
}
```

Important:
The html needs to have the model's id on the sortable item somewhere. The important line is the `data-rv-modelid`.
We use the models `cid` as that is unique to each model.

```html
<ul id="sortable" class="ui-sortable">
    <li class="ui-state-default" data-rv-each-fruit="collection:" data-rv-modelid="fruit.cid">
        {{fruit:type}}
    </li>
</ul>
```

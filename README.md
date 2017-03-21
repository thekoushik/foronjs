# ForonJS 

Simple inline DOM manipulation library

## Usage

Include the js file:
```
<script src="foron.js"></script>
```

Initialize whenever you want:
```
Foron.init();
```
then
```
<div>Some Text</div>
<span f-click="prev().set('New Content')">Click Me</span>
```
and run the html and click on the span.

Event | Description
--- | ---
f-click | click
f-rclick | right click
f-init | on foron init
f-bind | on change

Function | Description
--- | ---
id('element_id') | select element with id
next() | select next element
prev() | select previous element
parent() | select parent element
trigger('event') | trigger event
set('content') | set text
append('current') | append text
bind(optional selector) | set text of currently selected element with value
wait(millisecond) | delay the next operation in chain(bt execution will continue)
reset() | reset selection


## Author

* **Koushik Seal** - [thekoushik](https://github.com/thekoushik)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)


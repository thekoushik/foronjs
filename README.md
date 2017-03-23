# ForonJS 

Simple inline DOM manipulation library

## Usage

Include the js file:
```html
<script src="foron.js"></script>
```

Initialize whenever you want:
```javascript
Foron.init();
```
then
```html
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

#### DOMNode Functions

Function | Description
--- | ---
id('element_id') | select element with id
next() | select next element
prev() | select previous element
parent() | select parent element
trigger('event') | trigger event
set('content') | set text
append('current') | append text
addClass('class') | adds a class
removeClass('class') | removes a class
toggleClass('class') | toggles the provided class
toggleHide(with css) | toggles hide(with css otherwise with hidden)
bind(optional selector) | set text of currently selected element with value
wait(millisecond) | delay the next operation in chain(bt execution will continue)
reset() | reset selection [and queue]
me() | reset selection
log(attr, logger function) | logs attribute(default is value)
attr('attribute name') | attribute**
val() | value**
but() | resets the current condition chain

#### Value Functions ( ** Return value )

Function | Description
--- | ---
eq(value) | equals
ne(value) | not equals
gt(value) | greater than
gte(value) | greater than or equals
lte(value) | less than or equals
op(method,param1,param2,..) | invokes method on current value with params
then() | sets the current value as condition and sets the domnode chain
num() | converts to number(0 if not a number)

#### Example

```javascript
id('name1').val().eq('xyz').then().toggleHide()
```

## Author

* **Koushik Seal** - [thekoushik](https://github.com/thekoushik)

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

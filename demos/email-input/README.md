# Emails input - plain JS library

Emails input - Javascript library helps to implement input field to capture list of email IDs, allows to remove email ids and shows the validation error for the incorrect email-ids

## [Demo Link](https://rmanivannan.github.io/demos/email-input/) - https://rmanivannan.github.io/demos/email-input/

## How to usage

1. Include `<script src="js/email-input.js"></script>` in your HTML page (Preferably at the end of the page)

```HTML
<script src="js/email-input.js"></script>
```
2. use `EmailsInput`-js method to construct the email-input component on the desired DOM element, refer below code sample
```
var myEmailInput = EmailsInput(document.getElementById('container'));
```
3. `EmailsInput` returns `method:addEmail`, `method:getEmailListCount`, or `object:list`, which can be used for further operations, for example..
```
// Alert the Count of Email on click of `button:#get-email-count`
addEventLister(document.getElementById('get-email-count'),'click',function(e){
    alert(myEmailInput.getEmailListCount());
});

// Add new email ID through javascript
myEmailInput.addEmail("mani@mani.com");

```
4. Style the element as per you design spec, or use basic style avaiable in `css/email-input-page.css`

## Capabilities

### Optional Parameters - Header, Footer
2nd and 3rd - Parameters are `header` and `footer`, We can send text of DOM Element to render Header, Footer

### Method: addEmail
`addEmail` accepts `String: parameter` and the email is get added to the list.

### Method: getEmailListCount
`getEmailListCount` - returns the could of Email list

### Return Property: `list`
`list` contains list of email, Sample structure..
```
{
  "#id123" : {
      id : "#id123",
      val : "mani@mani.com",
      isValid : true // boolean
  },
  {...}
  ...
}
```

## TODO
1. Browser testing
2. get the valid list of email ids
...

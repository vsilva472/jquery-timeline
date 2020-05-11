# jQuery Timeline
[![license](https://img.shields.io/github/license/vsilva472/jquery-viacep.svg?style=flat-square)](https://github.com/vsilva472/jquery-viacep/blob/master/LICENSE) [![Release](https://img.shields.io/github/release/vsilva472/jquery-viacep.svg?style=flat-square)](https://github.com/vsilva472/jquery-viacep/releases) [![](https://data.jsdelivr.com/v1/package/npm/@vsilva472/jquery-viacep/badge)](https://www.jsdelivr.com/package/npm/@vsilva472/jquery-viacep)  [![npm](https://img.shields.io/npm/dm/@vsilva472/jquery-viacep.svg?style=flat-square)](https://www.npmjs.com/package/@vsilva472/jquery-viacep)

A dead simple jQuery plugin to create timelines. jQuery Timeline will fetch data from an user defined api with only ~3kb.


## Content
- [Browser Support](#browser-support)
- [Instalation](#instalation)
  - [Git](#git-installation)
  - [NPM](#npm-installation)
  - [Composer](#composer-installation)
  - [CDN](#CDN-installation)
- [Default Options](#default-options)
- [Usage](#usage)
  - [Via data-attributes](#using-with-default-data-selectors)
  - [Via css classes](#using-with-css-class-selectors)
  - [Mixed Selectors](#using-with-mixed-selctors)
- [Events](#events)
- [Advanced usage](#advanced-usage)
  - [Display a loading](#display-a-loading)
  - [Animations](#animations)
  - [Fetching from Laravel](#fetching-from-laravel)
  - [Google Analytics Integration](#google-analytics-integration)
  - [Google TagManager Integration](#google-tagmanager-integration)
- [Donate](#donate)

## Browser Support

![Internet Explorer](https://user-images.githubusercontent.com/4265802/60848376-bf7bdc80-a1bc-11e9-89db-5637ebad0352.png) | ![Chrome](https://user-images.githubusercontent.com/4265802/60848375-bee34600-a1bc-11e9-82bd-ab65ee37dd52.png) | ![Firefox](https://user-images.githubusercontent.com/4265802/60848374-bee34600-a1bc-11e9-84d3-7338811bf48d.png) | ![Opera](https://user-images.githubusercontent.com/4265802/60848373-bee34600-a1bc-11e9-9eb0-f72e9a75a14b.png) | ![Safari](https://user-images.githubusercontent.com/4265802/60848372-be4aaf80-a1bc-11e9-8c4e-680f7c0f21e4.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Último ✔ | Último ✔ | Último ✔ | Último ✔ |

## Instalation

##### Git installation
`git clone git@github.com:vsilva472/jquery-timeline.git` (SSH)  ou  
`git clone https://github.com/vsilva472/jquery-timeline.git` (HTTPS)

##### NPM installation
`npm i @vsilva472/jquery-timeline --save`

##### Composer installation
`composer require vsilva472/jquery-timeline`

##### CDN installation
[https://www.jsdelivr.com/package/npm/@vsilva472/jquery-timeline](https://www.jsdelivr.com/package/npm/@vsilva472/jquery-timeline)  

`<script src="https://cdn.jsdelivr.net/npm/@vsilva472/jquery-timeline@1/dist/jquery-timeline.min.css"></script>`

`<script src="https://cdn.jsdelivr.net/npm/@vsilva472/jquery-timeline@1/dist/jquery-timeline.min.js"></script>`



## Default options
```javascript
$.fn.timeline.defaults = {
    container : '[data-timeline]',
    apiUrl: null,
    allowRawContent: false
};
```

Attribute | Type | Default | Description
--- | --- | --- | --- |
container | String | `'[data-timeline]'` | The HTML element to render the timeline 
apiUrl | String | `null` | The url to fetch timeline data
allowRawContent| bool | `false` | Tell to plugin if it should use .html() or .text() to prevent XSS


**Note** You can setup this options via data-attribute from the container element;

```html
<div data-timeline="https://yourapi/fetch/timline/data" data-timeline-allow-raw-content>
```

Data attribute options will be used only if default options are not touched.

## Usage
### Using with default data selectors
```html
<div data-timeline="http://server/to/fetch/timeline/data"></div>
```

**Nota** You should call `$('selector').timeline(options)` only if you are using jQuery timeline without `data-attributes`


### Using with css class selectors
```html
<div class="my-timeline"></div>

<script>
$('.my-timeline').timeline({
    apiUrl: 'https://yourapi/fetch/timline/data',
    allowRawContent: true 
});
</script>
```

### Using with mixed selctors
```html
<div class="my-timeline" data-timeline-allow-raw-content></div>

<script>
$('.my-timeline').timeline({
    apiUrl: 'https://yourapi/fetch/timline/data',
});
</script>
```

The sample above is equivalent to the following configuration
```javascript
$.fn.timeline.defaults = {
    container : '.my-timeline',
    apiUrl: 'https://yourapi/fetch/timline/data',
    allowRawContent: true
};
```

## Events
jQuery timeline has a powerful events api that make its extensible and flexibel to be integrated with any html page or framework that has jquery installed.

Event | Description | Arguments
--- | --- | --- |
`timeline.start` | Triggered right before initialization | `{}`
`timeline.ajax.before` | Triggered before the ajax call | `{}`
`timeline.render.before` | Triggered before build html and right after receive data from ajax | `{}`
`timeline.ajax.fail ` | Triggered when ajax fail and receive | `{ jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown }`
`timeline.ajax.complete` | Triggered when ajax is complete (success or fail) | `{}`
`timeline.before.generate` | Triggered before build html structure and before append it to DOM | `{}`
`timeline.after.generate` | Triggered after build html structure and after append it to DOM | `{}`
 
 
## Advanced Usage
See bellow some jQuery Timeline advanced usage samples

### Display a loading

```html
<style>
.hide { display: none; }
</style>
<span class="hide loading">Please wait...</span>
<div data-timeline="https://yourapi/fetch/timline/data"></div>

<script>
$("[data-timeline]").on('timeline.ajax.before timeline.after.generate', function () {
    $('.loading').toggleClass('hide');
});
</script>
```

### Animations
You can even apply some animations to the timeline to make them visually more attractive

### Fetching from Laravel
Some frameworks like Laravel is a common practice the usage of a `CSRF-TOKEN` for security reasons. This sample shows you how to add `X-CSRF-TOKEN` before plugin make the request
```html
<div data-timeline="https://yourlaravel/fetch/timline/data"></div>

<script>
$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
</script>
``` 

### Google Analytics Integration
Maybe could be interesting to BI team extract some timeline usage informations. The following sample show how you can use jQuery Timeline event's api to send some events to Google Analytics


```html
<div id="xmas-timeline" data-timeline="https://yourlaravel/fetch/timline/data" class="season-timelines"></div>
<div id="easter-timeline" data-timeline="https://yourlaravel/fetch/timline/data" class="season-timelines"></div>

<script>
$('.season-timelines').on( 'timeline.after.generate', function ( e, response ) {
    ga( 'send', 'event', 'timeline', 'show', $(this).attr('id'));
});
</script>
```

### Google TagManager Integration
The bellow sample ilustrate the situation above but using Google TagManager.

```html
<div id="xmas-timeline" data-timeline="https://yourlaravel/fetch/timline/data" class="season-timelines"></div>
<div id="easter-timeline" data-timeline="https://yourlaravel/fetch/timline/data" class="season-timelines"></div>

<script>
$('.season-timelines').on( 'timeline.after.generate', function ( e, response ) {
    dataLayer.push({
        event: 'sendToGA',
        eventCategory: 'timeline',
        eventAction: 'show',
        eventLabel: $(this).attr('id')
    });
});
</script>
```

### Donate
Support this project donating some **HTMLCOIN**   
Wallet: **[HqgaiK6T1o2JP4p3p34CZp2g3XnSsSdCXp](htmlcoin:HqgaiK6T1o2JP4p3p34CZp2g3XnSsSdCXp?label=Doa%C3%A7%C3%B5es%20Github)**  
  
![Donate HTMLCoin](https://www.viniciusdesouza.com.br/img/htmlcoin.png)
 
 #### Licença
 MIT

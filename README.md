# jQuery Timeline
[![license](https://img.shields.io/github/license/vsilva472/jquery-timeline.svg?style=flat-square)](https://github.com/vsilva472/jquery-timeline/blob/master/LICENSE) [![Release](https://img.shields.io/github/release/vsilva472/jquery-timeline.svg?style=flat-square)](https://github.com/vsilva472/jquery-timeline/releases) [![](https://data.jsdelivr.com/v1/package/npm/@vsilva472/jquery-timeline/badge)](https://www.jsdelivr.com/package/npm/@vsilva472/jquery-timeline)  [![npm](https://img.shields.io/npm/dm/@vsilva472/jquery-timeline.svg?style=flat-square)](https://www.npmjs.com/package/@vsilva472/jquery-timeline)

A dead simple jQuery plugin to create responsives timelines with only ~3kb. You can find some online samples of usage [here](https://vsilva472.github.io/jquery-timeline/samples/index.html).

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
  - [Using a custom transformer](#using-a-custom-transformer)
- [Events](#events)
- [Advanced usage](#advanced-usage)
  - [Display a loading](#display-a-loading)
  - [Customizing appearance](#customizing-appearance)
  - [Animations](#animations)
  - [Fetching from Laravel](#fetching-from-laravel)
  - [Google Analytics Integration](#google-analytics-integration)
  - [Google TagManager Integration](#google-tagmanager-integration)
- [Donate](#donate)

## Browser Support

![Internet Explorer](https://user-images.githubusercontent.com/4265802/60848376-bf7bdc80-a1bc-11e9-89db-5637ebad0352.png) | ![Chrome](https://user-images.githubusercontent.com/4265802/60848375-bee34600-a1bc-11e9-82bd-ab65ee37dd52.png) | ![Firefox](https://user-images.githubusercontent.com/4265802/60848374-bee34600-a1bc-11e9-84d3-7338811bf48d.png) | ![Opera](https://user-images.githubusercontent.com/4265802/60848373-bee34600-a1bc-11e9-9eb0-f72e9a75a14b.png) | ![Safari](https://user-images.githubusercontent.com/4265802/60848372-be4aaf80-a1bc-11e9-8c4e-680f7c0f21e4.png)
--- | --- | --- | --- | --- |
IE 10+ ✔ | Last ✔ | Last ✔ | Last ✔ | Last ✔ |

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

`<script src="https://cdn.jsdelivr.net/npm/@vsilva472/jquery-timeline@1/dist/jquery.timeline.min.css"></script>`

`<script src="https://cdn.jsdelivr.net/npm/@vsilva472/jquery-timeline@1/dist/jquery.timeline.min.js"></script>`


## Default options
```javascript
$.fn.timeline.defaults = {
    container : '[data-timeline]',
    apiUrl: null,
    allowRawContent: false,
    transformer: function (data) {
        return data;
    }
};
```

Attribute | Type | Default | Description
--- | --- | --- | --- |
container | String | `'[data-timeline]'` | The HTML element to render the timeline 
apiUrl | String | `null` | The url to fetch timeline data
allowRawContent| bool | `false` | Tell to plugin if it should use .html() or .text() to prevent XSS
transformer | callback | `function (data) { return data; }` | The transform to transform the data comming from ajax request


**Note** You can setup this options via data-attribute from the container element;

```html
<div data-timeline="https://yourapi/fetch/timeline/data" data-timeline-allow-raw-content>
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
    apiUrl: 'https://yourapi/fetch/timeline/data',
    allowRawContent: true 
});
</script>
```

### Using with mixed selctors
```html
<div class="my-timeline" data-timeline-allow-raw-content></div>

<script>
$('.my-timeline').timeline({
    apiUrl: 'https://yourapi/fetch/timeline/data',
});
</script>
```

The sample above is equivalent to the following configuration
```javascript
$.fn.timeline.defaults = {
    container : '.my-timeline',
    apiUrl: 'https://yourapi/fetch/timeline/data',
    allowRawContent: true
};
```

### Using a custom transformer
By default jQuery Timeline expect that data received from the ajax request has the following structure:
```javascript
{
    [year: String] : [
        {
            title: String
            image: String | null,
            description: String | null,
            link: String | null
        }
    ],
    (...)
}

Example:
{
    "1999" : 
    [
        {
            title: 'Lorem ipsum'
            image: null
            description: 'Lorem ipsum dolor sit amet'
            link: 'http://www.google.com'
        }
    ]
}
```

But each api has your own logic and return your own format, fortunely jQuery Timeline has a method to transform your data before render the content.
In this cases you should provide your transform witch will adapt the data to the structure described above. 

In samples folder you can find a sample that describes this scenario.

```html
<div class="custom-transformer-timeline" style="margin-top: 50px;"></div>

<script>
(function ($) {
const transforer = (data) => {
  var transformed = {};

  data.forEach(item => {
    if (!transformed[item.year]) transformed[item.year] = [];

    transformed[item.year].push({
      year: item.year,
      title: item.caption,
      description: item.text || null,
      link: item.url || null,
      image: item.img || null,
    });
  });
  
  return transformed;
};

$(".custom-transformer-timeline").timeline({
  container: '.custom-transformer-timeline',
  apiUrl: 'api-2.json',
  transformer: transforer
});

$(".custom-transformer-timeline").on('timeline.after.generate', function () {
  $(this).addClass('timeline'); 
});
})(jQuery);
</script>
```

## Events
jQuery timeline has a powerful events api that make its extensible and flexibel to be integrated with any html page or framework that has jquery installed.

Event | Description | Arguments
--- | --- | --- |
`timeline.start` | Triggered right before initialization | `{}`
`timeline.ajax.before` | Triggered before the ajax call | `{}`
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
<div data-timeline="https://yourapi/fetch/timeline/data"></div>

<script>
$("[data-timeline]").on('timeline.ajax.before timeline.after.generate', function () {
  $('.loading').toggleClass('hide');
});
</script>
```

### Animations
jQuery Timeline applies the css class `.timeline-item` to each item of the timeline. This open the opportunity of to do some animations on these items with jquery and/or CSS. 

```html
<style type="text/css">
.timeline-item {
  opacity: 0;
  animation: fadeIn .3s;
  animation-fill-mode: forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

<script>
(function ($) {
  $('[data-timeline]').on( 'timeline.after.generate', function ( e, response ) {
    // delay(in seconds) before starts the animation of a item 
    var delay = 0.1;

    $('.timeline-item').each(function () {
      $(this).css('animation-delay', delay + 's');
      delay += 0.1;
    });
  });
} (jQuery));
</script>
```


### Customizing appearance
If you want to customize the elements of the timeline you should overwrite some css values in the following css classes.
```css
/* Responsible for year label style */
.timeline-year-label {} 

/* Responsible for timeline item title */
.timeline-item-title {}

/* Responsible for timeline line (center on desktop and left on mobile)*/
.timeline::before {}

/* Responsible for the image (if an item have one)*/
.timeline-item-image {}

/* Responsible for the description of an item */
.timeline-item-description  {}

/* Responsible for the timeline "dot" at the end of line */
.timeline-end {}

``` 

### Fetching from Laravel
Some frameworks like Laravel is a common practice the usage of a `CSRF-TOKEN` for security reasons. This sample shows you how to add `X-CSRF-TOKEN` before plugin make the request
```html
<div data-timeline="https://yourlaravel/fetch/timeline/data"></div>

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
<div id="xmas-timeline" data-timeline="https://yourlaravel/fetch/timeline/data" class="season-timelines"></div>
<div id="easter-timeline" data-timeline="https://yourlaravel/fetch/timeline/data" class="season-timelines"></div>

<script>
$('.season-timelines').on( 'timeline.after.generate', function ( e, response ) {
  ga( 'send', 'event', 'timeline', 'show', $(this).attr('id'));
});
</script>
```

### Google TagManager Integration
The bellow sample ilustrates the situation above but using Google TagManager.

```html
<div id="xmas-timeline" data-timeline="https://yourlaravel/fetch/timeline/data" class="season-timelines"></div>
<div id="easter-timeline" data-timeline="https://yourlaravel/fetch/timeline/data" class="season-timelines"></div>

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

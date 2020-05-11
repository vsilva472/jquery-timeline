'use strict';

;(function ($, undefined) {

    function Plugin( element, options ) {
        this.options = $.extend( {}, $.fn.timeline.defaults, options );
        this.options.container = $(this.options.container);
        this.resolveApiUrl().resolveRawContentOption();
        this.init();
    }

    Plugin.prototype.init = function () {

        this.dispatch('timeline.start');

        this.fetch(this.options.apiUrl);
    };

    Plugin.prototype.resolveApiUrl = function ()
    {
        var dataApiUrl = this.options.container.data('timeline');
        
        if (!this.options.apiUrl && !dataApiUrl) throw new Error('No api url found');
        
        if (!this.options.apiUrl) this.options.apiUrl = dataApiUrl;

        return this;
    }

    Plugin.prototype.resolveRawContentOption = function () {

        var dataAllowRawContent = this.options.container.data('timeline-allow-raw-content');

        if (!this.options.allowRawContent && !dataAllowRawContent) this.options.allowRawContent = false;

        if (dataAllowRawContent !== undefined) this.options.allowRawContent = !!dataAllowRawContent;

        return this;
    };

    Plugin.prototype.fetch = function (apiUrl) {

        this.dispatch('timeline.ajax.before');

        var timeline = this, $ajax = $.getJSON(apiUrl, function () {});

        $ajax.done(function (response) {
            timeline.dispatch('timeline.before.generate', { data: response });
            timeline.buildWith(response);
        });

        $ajax.fail(function (jqXHR, textStatus, errorThrown) {
            timeline.dispatch('timeline.ajax.fail', { jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown });
        });

        $ajax.always(function () {
            timeline.dispatch('timeline.ajax.complete');
        });
    };

    Plugin.prototype.buildWith = function (data) {

        var self = this;

        Object.keys(data).forEach(function (year) {
           self.createYearLabel(year).appendTo(self.options.container);
           
           var $wrapper = $('<div />').addClass('timeline-item-wrapper');
           
           data[year].forEach(function (item) {
                self.createItem(item).appendTo($wrapper);
           });

           $wrapper.appendTo(self.options.container);
        });

        this.options.container.append('<span class="timeline-end timeline-item">');

        this.dispatch('timeline.after.generate');
    };

    Plugin.prototype.createYearLabel = function (year) {

        var $container = $('<div />').addClass('timeline-year-container timeline-item')
        $('<span />').addClass('timeline-year-label').text(year).appendTo($container);
        
        return $container;
    };    

    Plugin.prototype.createTitle = function (item) {

        var $title = item.link 
            ? $('<a />').attr({href: item.link.trim(), tagert: '_blank'})
                .addClass('timeline-item-title timeline-item').text(item.title.trim()) 
           
            : $('<div />').addClass('timeline-item-title timeline-item')
                .text(item.title.trim());
        
        return $title;
    };

    Plugin.prototype.createImage = function (item) {

        var $image = item.image 
            ? $('<img />').attr('src', item.image.trim())
                .addClass('timeline-item-image timeline-item') 
            : null;

        if (!item.link) return $image;

        if ($image) return $('<a />').attr({ href: item.link.trim(), target: '_blank' }).append($image);
    };

    Plugin.prototype.createDescription = function (item) {

        var $p = item.description 
            ? $('<p />').addClass('timeline-item-description timeline-item') 
            : null;
        
        var content = this.prepareContent(item.description);
        
        if ($p && item.link) $('<a />')
            .attr({ href: item.link.trim(), target: '_blank' })
            .append(content).appendTo($p);

        else if ($p) $p.append(content);
        
        return $p;
    };

    Plugin.prototype.prepareContent = function (content) {

        if(this.options.allowRawContent) return $('<span />').html(content);
        
        return $('<span />').text(content);
    };

    Plugin.prototype.createItem = function (item) {    

        var $container  = $('<div />').addClass('timeline-item-container');
        var $body       =  $('<div />').addClass('timeline-item-body');
        
        var $image          = this.createImage(item);
        var $description    = this.createDescription(item);

        this.createTitle(item).appendTo($container);

        if ($image) $image.appendTo($body);
        if ($description) $description.appendTo($body);

        $body.appendTo($container);

        return $container;
    };

    Plugin.prototype.dispatch = function (event, data) {

        this.options.container.trigger(event, data);
    };

    $.fn.timeline = function ( options ) {

        return this.each( function () {
            if ( ! $.data( this, "plugin" ) ) {
                $.data( this, "plugin", new Plugin( this, options ) );
            }
        });
    };

    $.fn.timeline.defaults = {
        container : '[data-timeline]',
        apiUrl: null,
        allowRawContent: false
    };

    $( document ).ready( function () {
        $($.fn.timeline.defaults.container).on('timeline.after.generate', function () {
            $(this).addClass('timeline');
        }).timeline();

    });
})( jQuery, undefined );
/*!
 * Social Network Template 3.0.0
 * Author: mosaicpro
 * Licence: http://themeforest.net/licenses
 * Copyright 2014
 */

(function ($) {
    $(window).setBreakpoints({
        distinct: true,
        breakpoints: [
            320,
            480,
            768
        ]
    });
    $(window).bind('enterBreakpoint320', function () {
        var img = $('.messages-list .panel ul img');
        $('.messages-list .panel ul').width(img.first().width() * img.length);
    });
    $(window).bind('exitBreakpoint320', function () {
        $('.messages-list .panel ul').width('auto');
    });
    $(window).bind('enterBreakpoint768', function () {
        $("body").addClass('show-sidebar');
        $("body").removeClass('show-chat');
    });
    $(window).bind('exitBreakpoint768', function () {
        $("body").removeClass('show-sidebar');
        $("body").removeClass('show-chat');
    });
})(jQuery);

(function ($) {

    // Progress Bar Animation
    var bar = $('.progress-bar');
    $(bar).each(function () {
        bar_width = $(this).attr('aria-valuenow');
        $(this).width(bar_width + '%');
    });

})(jQuery);
(function ($) {

    // match anything
    $.expr[":"].containsNoCase = function (el, i, m) {
        var search = m[3];
        if (!search) return false;
        return new RegExp(search, "i").test($(el).text());
    };

    // input filter
    $.fn.searchFilter = function (options) {
        var opt = $.extend({
            // target selector
            targetSelector: "",
            // number of characters before search is applied
            charCount: 1
        }, options);

        return this.each(function () {
            var $el = $(this);
            $el.off("keyup", searchFilterCallBack);
            $el.on("keyup", null, {opt: opt}, searchFilterCallBack);
        });

    };

    // Filter by All/Online/Offline
    $(".chat-filter a").on('click', function (e) {

        e.preventDefault();
        $('.chat-contacts li').hide();
        $('.chat-contacts').find($(this).data('target')).show();

        $(".chat-filter li").removeClass('active');
        $(this).parent().addClass('active');


        $(".chat-search input").searchFilter({ targetSelector: ".chat-contacts " + $(this).data('target') });

        // Filter Contacts by Search and Tabs
        searchFilterCallBack($(".chat-search input"), { targetSelector: ".chat-contacts " + $(this).data('target'), charCount: 1 });
    });

    // Trigger Search Filter
    $(".chat-search input").searchFilter({ targetSelector: ".chat-contacts li"});

    var container = $('.chat-window-container');


    // Click User
    $(".chat-contacts li").on('click', function () {

        if ($('.chat-window-container [data-user-id="' + $(this).data('userId') + '"]').length) return;

        // If user is offline do nothing
        if ($(this).attr('class') === 'offline') return;

        var source = $("#chat-window-template").html();
        var template = Handlebars.compile(source);

        var context = {user_image: $(this).find('img').attr('src'), user: $(this).find('.contact-name').text()};
        var html = template(context);


        var clone = $(html);

        clone.attr("data-user-id", $(this).data("userId"));

        container.find('.panel:not([id^="chat"])').remove();

        var count = container.find('.panel').length;

        count++;

        if (count >= 3) {
            container.find('#chat-0003').remove();
            count = 3;
        }

        clone.attr('id', 'chat-000' + parseInt(count));
        container.append(clone);

        clone.show();
        clone.find('> .panel-body').removeClass('display-none');
        clone.find('> input').removeClass('display-none');
    });

    // remove window
    $("body").on('click', ".chat-window-container .close", function () {
        $(this).parent().parent().remove();
        chatLayout();
    });

    // Change ID by No. of Windows
    function chatLayout() {
        container.find('.panel').each(function (index, value) {
            $(this).attr('id', 'chat-000' + parseInt(index + 1));
        });
    }

    // Chat heading collapse window
    $('body').on('click', '.chat-window-container .panel-heading', function (e) {
        e.preventDefault();
        $(this).parent().find('> .panel-body').toggleClass('display-none');
        $(this).parent().find('> input').toggleClass('display-none');
    });
})(jQuery);

// Search Filter
function searchFilterCallBack($data, $opt) {
    var search = $data instanceof jQuery ? $data.val() : $(this).val(),
        opt = typeof $opt == 'undefined' ? $data.data.opt : $opt;

    var $target = $(opt.targetSelector);
    $target.show();

    if (search && search.length >= opt.charCount) {
        $target.not(":containsNoCase(" + search + ")").hide();
    }
}


var toggle = (function (toggleId, toggleClass) {
    var toggleBtn = $(toggleId);
    // If No Sidebar Exit
    if (!toggleBtn.length) return;

    toggleBtn.on('click', function () {
        $('body').removeClass(function (index, data) {
            if (toggleId === "#toggle-sidebar-menu") {
                if (data === 'show-chat') {
                    $('body').removeClass('show-chat');
                }
            }
            if (toggleId === "#toggle-chat") {

                if (data === "") {
                    $('body').addClass('show-sidebar');
                }
                $('body').removeClass('show-sidebar');

            }
        });
        $('body').toggleClass(toggleClass);

        // Check chat windows
        checkChat();
    });
});

(function ($) {

    toggle("#toggle-sidebar-menu", "show-sidebar");

    // Scroll
    $('#menu').niceScroll({cursorborder: 0, cursorcolor: "#25ad9f"});
    $('#menu').getNiceScroll().resize();
    $('#menu ul.collapse').on('shown.bs.collapse', function (e) {
        $('#menu').getNiceScroll().resize();
    });


    // Collapse
    $('#menu ul.collapse').on('show.bs.collapse', function (e) {
        e.stopPropagation();
        var parents = $(this).parents('ul:first').find('> li.open [data-toggle="collapse"]');
        if (parents.length) {
            parents.trigger('click');
        }
        $(this).parent().addClass("open");
    });

    $('#menu ul.collapse').on('hidden.bs.collapse', function (e) {
        e.stopPropagation();
        $(this).parent().removeClass("open");
    });

}(jQuery));
/**
 * jQuery Grid-A-Licious(tm) v3.01
 *
 * Terms of Use - jQuery Grid-A-Licious(tm)
 * under the MIT (http://www.opensource.org/licenses/mit-license.php) License.
 *
 * Copyright 2008-2012 Andreas PihlstrÃ¶m (Suprb). All rights reserved.
 * (http://suprb.com/apps/gridalicious/)
 *
 */

// Debouncing function from John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
// Copy pasted from http://paulirish.com/2009/throttled-smartresize-jquery-event-handler/

(function ($, sr) {
    var debounce = function (func, threshold, execAsap) {
        var timeout;
        return function debounced() {
            var obj = this,
                args = arguments;

            function delayed() {
                if (!execAsap) func.apply(obj, args);
                timeout = null;
            }

            if (timeout) clearTimeout(timeout);
            else if (execAsap) func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 150);
        };
    };
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };
})(jQuery, 'smartresize');

// The Grid-A-Licious magic

(function ($) {

    $.Gal = function (options, element) {
        this.element = $(element);
        this._init(options);
    };

    $.Gal.settings = {
        selector: '.item',
        width: 225,
        gutter: 20,
        animate: false,
        animationOptions: {
            speed: 200,
            duration: 300,
            effect: 'fadeInOnAppear',
            queue: true,
            complete: function () {
            }
        },
    };

    $.Gal.prototype = {

        _init: function (options) {
            var container = this;
            this.name = this._setName(5);
            this.gridArr = [];
            this.gridArrAppend = [];
            this.gridArrPrepend = [];
            this.setArr = false;
            this.setGrid = false;
            this.setOptions = '';
            //this.setOptions;
            this.cols = 0;
            this.itemCount = 0;
            this.prependCount = 0;
            this.isPrepending = false;
            this.appendCount = 0;
            this.resetCount = true;
            this.ifCallback = true;
            this.box = this.element;
            this.options = $.extend(true, {}, $.Gal.settings, options);
            this.gridArr = $.makeArray(this.box.find(this.options.selector));
            this.isResizing = false;
            this.w = 0;
            this.boxArr = [];

            // build columns
            this._setCols();
            // build grid
            this._renderGrid('append');
            // add class 'gridalicious' to container
            $(this.box).addClass('gridalicious');
            // add smartresize
            $(window).smartresize(function () {
                container.resize();
            });
        },

        _setName: function (length, current) {
            current = current ? current : '';
            return length ? this._setName(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
        },

        _setCols: function () {
            // calculate columns
            this.cols = Math.floor(this.box.width() / this.options.width);
            //If Cols lower than 1, the grid disappears
            if (this.cols < 1) {
                this.cols = 1;
            }
            diff = (this.box.width() - (this.cols * this.options.width) - this.options.gutter) / this.cols;
            w = (this.options.width + diff) / this.box.width() * 100;
            this.w = w;
            // add columns to box
            for (var i = 0; i < this.cols; i++) {
                var div = $('<div></div>').addClass('galcolumn').attr('id', 'item' + i + this.name).css({
                    'width': w + '%',
                    'paddingLeft': this.options.gutter,
                    'paddingBottom': this.options.gutter,
                    'float': 'left',
                    '-webkit-box-sizing': 'border-box',
                    '-moz-box-sizing': 'border-box',
                    '-o-box-sizing': 'border-box',
                    'box-sizing': 'border-box'
                });
                this.box.append(div);
            }


            this.box.find($('#clear' + this.name)).remove();
            // add clear float
            var clear = $('<div></div>').css({
                'clear': 'both',
                'height': '0',
                'width': '0',
                'display': 'block'
            }).attr('id', 'clear' + this.name);
            this.box.append(clear);
        },

        _renderGrid: function (method, arr, count, prepArray) {
            var items = [];
            var boxes = [];
            var prependArray = [];
            var itemCount = 0;
            var prependCount = this.prependCount;
            var appendCount = this.appendCount;
            var gutter = this.options.gutter;
            var cols = this.cols;
            var name = this.name;
            var i = 0;
            var w = $('.galcolumn').width();

            // if arr
            if (arr) {
                boxes = arr;
                // if append
                if (method == "append") {
                    // get total of items to append
                    appendCount += count;
                    // set itemCount to last count of appened items
                    itemCount = this.appendCount;
                }
                // if prepend
                if (method == "prepend") {
                    // set itemCount
                    this.isPrepending = true;
                    itemCount = Math.round(count % cols);
                    if (itemCount <= 0) itemCount = cols;
                }
                // called by _updateAfterPrepend()
                if (method == "renderAfterPrepend") {
                    // get total of items that was previously prepended
                    appendCount += count;
                    // set itemCount by counting previous prepended items
                    itemCount = count;
                }
            }
            else {
                boxes = this.gridArr;
                appendCount = $(this.gridArr).size();
            }

            // push out the items to the columns
            $.each(boxes, function (index, value) {
                var item = $(value);
                var width = '100%';

                // if you want something not to be "responsive", add the class "not-responsive" to the selector container
                width = 'auto';


                item.css({
                    'marginBottom': gutter,
                    'zoom': '1',
                    'filter': 'alpha(opacity=0)',
                    'opacity': '0'
                });

                // prepend on append to column
                if (method == 'prepend') {
                    itemCount--;
                    $("#item" + itemCount + name).prepend(item);
                    items.push(item);
                    if (itemCount === 0) itemCount = cols;

                } else {
                    $("#item" + itemCount + name).append(item);
                    items.push(item);
                    itemCount++;
                    if (itemCount >= cols) itemCount = 0;
                    if (appendCount >= cols) appendCount = (appendCount - cols);
                }
            });

            this.appendCount = appendCount;
            this.itemCount = itemCount;

            if (method == "append" || method == "prepend") {
                if (method == "prepend") {
                    // render old items and reverse the new items
                    this._updateAfterPrepend(this.gridArr, boxes);
                }
                this._renderItem(items);
                this.isPrepending = false;
            } else {
                this._renderItem(this.gridArr);
            }
        },

        _collectItems: function () {
            var collection = [];
            $(this.box).find(this.options.selector).each(function (i) {
                collection.push($(this));
            });
            return collection;
        },

        _renderItem: function (items) {

            var speed = this.options.animationOptions.speed;
            var effect = this.options.animationOptions.effect;
            var duration = this.options.animationOptions.duration;
            var queue = this.options.animationOptions.queue;
            var animate = this.options.animate;
            var complete = this.options.animationOptions.complete;

            var i = 0;
            var t = 0;

            // animate
            if (animate === true && !this.isResizing) {

                // fadeInOnAppear
                if (queue === true && effect == "fadeInOnAppear") {
                    if (this.isPrepending) items.reverse();
                    $.each(items, function (index, value) {
                        setTimeout(function () {
                            $(value).animate({
                                opacity: '1.0'
                            }, duration);
                            t++;
                            if (t == items.length) {
                                complete.call(undefined, items);
                            }
                        }, i * speed);
                        i++;
                    });
                } else if (queue === false && effect == "fadeInOnAppear") {
                    if (this.isPrepending) items.reverse();
                    $.each(items, function (index, value) {
                        $(value).animate({
                            opacity: '1.0'
                        }, duration);
                        t++;
                        if (t == items.length) {
                            if (this.ifCallback) {
                                complete.call(undefined, items);
                            }
                        }
                    });
                }

                // no effect but queued
                if (queue === true && !effect) {
                    $.each(items, function (index, value) {
                        $(value).css({
                            'opacity': '1',
                            'filter': 'alpha(opacity=1)'
                        });
                        t++;
                        if (t == items.length) {
                            if (this.ifCallback) {
                                complete.call(undefined, items);
                            }
                        }
                    });
                }

                // don not animate & no queue
            } else {
                $.each(items, function (index, value) {
                    $(value).css({
                        'opacity': '1',
                        'filter': 'alpha(opacity=1)'
                    });
                });
                if (this.ifCallback) {
                    complete.call(items);
                }
            }
        },

        _updateAfterPrepend: function (prevItems, newItems) {
            var gridArr = this.gridArr;
            // add new items to gridArr
            $.each(newItems, function (index, value) {
                gridArr.unshift(value);
            });
            this.gridArr = gridArr;
        },

        resize: function () {
            // delete columns in box
            this.box.find($('.galcolumn')).remove();
            // build columns
            this._setCols();
            // build grid
            this.ifCallback = false;
            this.isResizing = true;
            this._renderGrid('append');
            this.ifCallback = true;
            this.isResizing = false;
        },

        append: function (items) {
            var gridArr = this.gridArr;
            var gridArrAppend = this.gridArrPrepend;
            $.each(items, function (index, value) {
                gridArr.push(value);
                gridArrAppend.push(value);
            });
            this._renderGrid('append', items, $(items).size());
        },

        prepend: function (items) {
            this.ifCallback = false;
            this._renderGrid('prepend', items, $(items).size());
            this.ifCallback = true;
        }
    };

    $.fn.gridalicious = function (options, e) {
        if (typeof options === 'string') {
            this.each(function () {
                var container = $.data(this, 'gridalicious');
                container[options].apply(container, [e]);
            });
        } else {
            this.each(function () {
                $.data(this, 'gridalicious', new $.Gal(options, this));
            });
        }
        return this;
    };
})(jQuery);

/*
 * MAIN FILE
 * */
(function ($) {

    // Chat TOGGLE
    toggle("#toggle-chat", "show-chat");

    // OffCanvas
    $('[data-toggle="offcanvas"]').click(function () {
        $('.row-offcanvas').toggleClass('active');
    });

    // Tooltip
    $("body").tooltip({selector: '[data-toggle="tooltip"]', container: "body"});

    // Table Checkbox All
    $('#checkAll').on('click', function (e) {
        $(this).closest('table').find('td input:checkbox').prop('checked', this.checked);
    });


    $('[data-toggle*="gridalicious"]').each(function () {
        $(this).gridalicious(
            {
                gutter: 15,
                width: 370,
                selector: '.timeline-block'

            });
    });

    $('#users-filter-select').on('change', function () {
        if (this.value === 'name') {
            $('#user-first').removeClass('hidden');
            $('#user-search-name').removeClass('hidden');
        } else {
            $('#user-first').addClass('hidden');
            $('#user-search-name').addClass('hidden');
        }
        if (this.value === 'friends') {
            $('.select-friends').removeClass('hidden');

        } else {
            $('.select-friends').addClass('hidden');
        }
        if (this.value === 'name') {
            $('.search-name').removeClass('hidden');

        } else {
            $('.search-name').addClass('hidden');
        }
    });


    $('.selectpicker').selectpicker();
    // Datepicker INIT
    $('.datepicker').datepicker({});
    // Minicolors INIT
    $('.minicolors').each(function () {
        $(this).minicolors({
            control: $(this).attr('data-control') || 'hue',
            defaultValue: $(this).attr('data-defaultValue') || '',
            inline: $(this).attr('data-inline') === 'true',
            letterCase: $(this).attr('data-letterCase') || 'lowercase',
            opacity: $(this).attr('data-opacity'),
            position: $(this).attr('data-position') || 'bottom left',
            change: function (hex, opacity) {
                if (!hex) return;
                if (opacity) hex += ', ' + opacity;
                if (typeof console === 'object') {
                    console.log(hex);
                }
            },
            theme: 'bootstrap'
        });
    });
    // Table Checkbox All
    $('#checkAll').on('click', function (e) {
        $(this).closest('table').find('td input:checkbox').prop('checked', this.checked);
    });


    $('.share textarea').on('keyup', function () {
        $(".share button")[$(this).val() === '' ? 'hide' : 'show']();
    });


    checkChat();

    // STOP NAVBAR TOGGLE CLICK
    $(".navbar .navbar-nav .dropdown-toggle").on('click', function (e) {
        e.stopPropagation();
    });

    // Slider Init
    // Instantiate a slider
    $('#ex1').slider({
        formatter: function (value) {
            return 'Current value: ' + value;
        }
    });
    $("#ex2").slider({});
    $("#ex6").slider();
    $("#ex6").on("slide", function (slideEvt) {
        $("#ex6SliderVal").text(slideEvt.value);
    });

    $('.slider-handle').html('<i class="fa fa-bars fa-rotate-90"></i>');

    $('.navbar .alert').on('click', function () {
        $(".chat-contacts li:first").trigger('click');
        $(this).hide();
        //alert();
    });

    var nice = $('.messages-list .panel').niceScroll({cursorborder: 0, cursorcolor: "#25ad9f", zindex: 1});
    var _super = nice.getContentSize;
    nice.getContentSize = function () {
        var page = _super.call(nice);
        page.h = nice.win.height();
        return page;
    };


    if (!$("#scroll-spy").length) {
        return;
    }
    else {
        var offset = $("#scroll-spy").offset().top;
        $('body').scrollspy({ target: '#scroll-spy', offset: offset});
    }


}(jQuery));


(function ($) {
    // Ratings
    $('.rating span.star').on('click', function () {
        var total = $(this).parent().children().length;
        var clickedIndex = $(this).index();
        $('.rating span.star').removeClass('filled');
        for (var i = clickedIndex; i < total; i++) {
            $('.rating span.star').eq(i).addClass('filled');
        }
    });
}(jQuery));


function checkChat() {
    if (!$('body').hasClass('show-chat')) {
        //alert('no chat ');
        $('.chat-window-container .panel-body').addClass('display-none');
        $('.chat-window-container input').addClass('display-none');
    } else {
        $('.chat-window-container .panel-body').removeClass('display-none');
        $('.chat-window-container input').removeClass('display-none');
    }
}
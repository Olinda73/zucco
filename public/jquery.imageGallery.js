(function($) {

    $.fn.imageGallery = function(options) {
        var defaults = {
            width: 'auto',
            height: 'auto',
            itemSelector: '.galleryItem',
            nextPrevButtons: false,
            itemButtons: false,
            playPause: false,
            transition: 'opacity',
            transspeed: '1000',
            speed: '5000',
            reverse:true,
            imgSelector: '',
            autoplay: true,
            resizable: true,
            itembuttonstarget:'',
            callback:function() { }
        }
        
        return this.each(function() {
            var o = $.extend(defaults, options);
            var itemIndex = -1;
            var waitingIndex = -1;
            var reverse = o.reverse;
            var tstartX, tstartY, tX, tY;
            var g = $(this);
            var gi = g.find(o.itemSelector);
            gi.find('img'+o.imgSelector).each(function(index, a) {
                var img = new Image();
                img.onload = function() {
                    ti = $(a);
                    ti.attr('loaded',true);
                    if(waitingIndex == ti.attr('index')) {
                        g.find('.loading').remove();
                        waitingIndex = -1;
                        transitionIn(ti.attr('index'));
                        checkSizes();
                    }
                };
                img.src = this.src;
                var ti = $(this);
                ti.attr('index',index);
                ti.parents(o.itemSelector).attr('index',index);
                if(ti.attr('complete')) {
                    ti.attr('loaded',true);
                }
            });
            var playing = o.autoplay;
            var playTimer;
            g.css({
                'position':'relative',
                'overflow':'hidden'
            });
            gi.css( { 
                'position':'absolute',
                'top':'0px',
                'left':'0px',
                'width':'100%',
                'height':'100%'
            }).hide();
            
            g.append('<div class="transitionLayer"></div>');
            tl = g.children('.transitionLayer').css({
                'position':'absolute',
                'display':'none',
                'top':'0px',
                'left':'0px',
                'width':'100%',
                'height':'100%',
                'z-index':3
            });
            
            if(o.width != 'auto') {
                g.width(o.width);
            }
            if(o.height != 'auto') {
                g.height(o.height);
            }
            
            if(o.nextPrevButtons) {
                g.after('<div class="leftButton"><span></span></div><div class="rightButton"><span></span></div>');
                g.siblings('.leftButton').click(clickLeft);
                g.siblings('.rightButton').click(clickRight);			
            }
            
            gi.bind('touchstart', function(e) {
                    var touch = e.originalEvent.touch || e.originalEvent.touches[0];
                    tstartX = touch.pageX;
                    tstartY = touch.pageY;
                    e.stopPropagation();
                }).bind('touchmove', function(e) {
                    var touch = e.originalEvent.touch || e.originalEvent.touches[0];
                    tX = touch.pageX;
                    tY = touch.pageY;
                    
                    if(tX < tstartX - 10 || tX > tstartX + 10) {
                        e.preventDefault();
                    }
                    e.stopPropagation();
                }).bind('touchend', function(e) {
                    if(tstartX && tX) {
                        if(tX < tstartX - 20 || tX > tstartX + 20) {
                        
                            var origTrans = o.transition;
                            if(tX < tstartX - 20) {
                                o.transition = "left";
                                clickRight();
                            }
                            if(tX > tstartX + 20) {
                                o.transition = "left";
                                clickLeft();
                            }
                            o.transition = origTrans;
                            e.stopPropagation();
                        }
                        tstartX = tstartY = tX = tY = false;
                    }
                });
            
            if(o.playPause) {
                g.append('<div class="playpause"></div>');
                g.children('.playpause').click(function(){
                    if(playing) {
                        playing = false;
                        g.children('.playpause').addClass('paused');
                        clearTimeout(playTimer);
                    } else {
                        playing = true;
                        g.children('.playpause').removeClass('paused');
                        transitionIn();
                    }
                });
            }
            
            if(o.itemButtons) {
                var ib;
                if(o.itembuttonstarget) {
                    $(o.itembuttonstarget).append('<div class="itemButtons"></div>')
                    ib = $(o.itembuttonstarget).children('.itemButtons');
                } else {
                    g.append('<div class="itemButtons"></div>');
                    ib = g.children('.itemButtons');
                }
                
                gi.each(function(i) {
                    thisgi = $(this);
                    if(thisgi.find('img:first').attr('data-thumb')) {
                        ib.append('<div class="itemButton thumbnailButton" data-index="'+i+'"><span></span><img src="'+thisgi.find('img:first').attr('data-thumb')+'" alt="" /></div>');
                    } else {
                        ib.append('<div class="itemButton" data-index="'+i+'"></div>');
                    }
                    var nb = ib.children('.itemButton[data-index='+i+']');
                    nb.click(function(e) {
                        playing = false;
                        g.children('.playpause').addClass('paused');
                        clearTimeout(playTimer);
                        ti = $(this);
                        if(itemIndex > ti.attr('data-index')) {
                            reverse = true;
                        }
                        ti.siblings().removeClass('activeButton');
                        ti.addClass('activeButton');
                        transitionIn(parseInt(ti.attr('data-index')));
                        e.stopPropagation();
                    });
                });
            }
            
            switch(o.transition) {
                case 'right':
                case 'left':
                    $(window).load(function() {
                        $(window).resize(function() {
                            var ai = gi.filter('.activeItem');
                            if(ai.length > 0) {
                                ai.siblings(o.itemSelector).css('left','100%');
                            }
                        });
                    });
                break
            }
            
            $(window).resize(function() {
                checkSizes();
            });
            
            function clickLeft() {
                playing = false;
                clearTimeout(playTimer);
                g.children('.playpause').addClass('paused');
                reverse = true;
                transitionIn(itemIndex-1);
            }
            function clickRight(){
                playing = false;
                g.children('.playpause').addClass('paused');
                clearTimeout(playTimer);
                transitionIn();
            }
            
            function checkSizes() {
                g.children(o.itemSelector + ':not(.activeItem)').hide();
                g.css({'min-height':'', 'height':''});
                var minheight = g.children('.activeItem').height();
                //if(g.children('.activeItem').css('display') == "none" || g.children('.activeItem').find('img'+o.imgSelector).height() == 0) {
                    var ai = g.children('.activeItem');
                    var h = 0;
                    var c = ai.children().filter(function() {
                        var posi = $(this).css('position');
                        var floa = $(this).css('float');
                        return posi != 'absolute' && floa == 'none';
                    }).each(function() {
                        h += $(this).height();
                    })
                    var childrenheight = h;
                    if(childrenheight != minheight) {
                        minheight += childrenheight;
                    }
                    if(g.find('img'+o.imgSelector).length == 0 && g.width() > 0) {
                        g.children(o.itemSelector).width(g.width());
                    }
                //}
                if(g.find('img'+o.imgSelector).length > 0) {
                    g.css('height',minheight);
                }
                g.css('min-height',minheight);
            }
            
            transitionIn(0);
            
            function transitionIn(i) {
                var lastIndex = itemIndex;
                if(!isNaN(i)) {
                    itemIndex = parseInt(i);
                } else {
                    itemIndex++;
                }
                
                if(itemIndex < 0) {
                    itemIndex += gi.length;
                } else if(itemIndex > gi.length - 1) {
                    itemIndex -= gi.length;
                }
                
                var ni = gi.slice(itemIndex,itemIndex+1);
                var li = gi.slice(lastIndex,lastIndex+1);
                ni.stop(true,true).find('div').stop(true,true);
                li.stop(true,true).find('div').stop(true,true);
                if((ni.find('img'+o.imgSelector).attr('loaded') || ni.find('img'+o.imgSelector).length == 0) && !ni.is(':animated') && !li.is(':animated') && !tl.children().is(':animated')) {
                    if(li.html() != ni.html()) {
                        
                        if(o.resizable && gi.filter('.activeItem').length == 0) {
                            var heightcheck = setInterval(function() {
                                if(ni.height() > g.height() && ni.height() > 0) {
                                    g.height(ni.height());
                                    clearInterval(heightcheck);
                                }
                            }, 50);
                        }
                        
                        li.removeClass('activeItem').css('z-index',1);
                        ni.addClass('activeItem').css('z-index',5);
                        
                        if(li.css('display') != 'block') {
                            $(window).resize();
                        }
                        
                        var transition = ni.attr('data-transition') || o.transition;
                        var dl =  ni.attr('data-display-length') || o.speed;
                        
                        if(playing) {
                            playTimer = setTimeout( function() {
                                transitionIn();
                            },dl);
                        }
                        if(reverse) {
                            switch(transition) {
                                case 'right':
                                    transition = "left";
                                    break;
                                case 'left':
                                    transition = "right";
                                    break;
                                case 'top':
                                    transition = "bottom";
                                    break;
                                case 'bottom':
                                    transition = "top";
                                    break;
                            }
                            reverse = false;
                        }
                        switch(transition) {
                            case 'right':
                                if(li.css('display') == 'block') {
                                    ni.css('left',"-" + ni.outerWidth() +"px").show();
                                    ni.animate({ left:"0px" },o.transspeed, o.callback);
                                    li.animate({ left:ni.outerWidth()+"px" },o.transspeed);
                                } else {
                                    ni.show();
                                }
                                break;
                            case 'left':
                                if(li.css('display') == 'block') {
                                    ni.css('left',ni.outerWidth() +"px").show();
                                    ni.animate({ left:"0px" },o.transspeed, o.callback);
                                    li.animate({ left:"-" + ni.outerWidth()+"px" },o.transspeed);
                                } else {
                                    ni.show();
                                }
                                break;
                            case 'top':
                                if(li.css('display') == 'block') {
                                    ni.css('top',"-" + ni.outerHeight() +"px").show();
                                    ni.animate({ top:"0px" },o.transspeed, o.callback);
                                    li.animate({ top:ni.outerHeight()+"px" },o.transspeed);
                                } else {
                                    ni.show();
                                }
                                break;
                            case 'bottom':
                                if(li.css('display') == 'block') {
                                    ni.css('top',ni.outerHeight() +"px").show();
                                    ni.animate({ top:"0px" },o.transspeed, o.callback);
                                    li.animate({ top:"-" + ni.outerHeight()+"px" },o.transspeed);
                                } else {
                                    ni.show();
                                }
                                break;
                            case 'checkerboard':
                                var img = ni.find('img');
                                ni.show();
                                var sizeX = Math.ceil(ni.width()/10);
                                var sizeY = Math.ceil(ni.height()/8);
                                img.hide();
                                tl.html('');
                                for (x = 0; x < 10; x++) {
                                    for (y = 0; y < 8; y++) {
                                        $("<div />").css({
                                            width: sizeX,
                                            height: sizeY,
                                            left: x * sizeX,
                                            top: y * sizeY,
                                            backgroundPosition: "-" + x * sizeX + "px -" + y * sizeY + "px",
                                            position:'absolute',
                                            display:'none',
                                            'background-image': 'url(' +img.attr('src') +')'
                                        }).appendTo(tl);
                                    }
                                }
                                tl.show().children().each( function(a,i) {
                                    $(this).delay(Math.random() * (o.transspeed*0.75)).fadeIn(o.transspeed/4,function() {
                                        var tb = $(this);
                                        if(tb.siblings().length == tb.siblings(':visible:not(:animated)').length) {
                                            tb.parent().siblings('.activeItem').find('img').show();
                                            tl.hide();
                                            o.callback();
                                        }
                                    });
                                });
                                break;
                            case 'joinV':
                                var img = ni.find('img');
                                ni.show();
                                var sizeX = Math.ceil(ni.width() + (ni.width()/2));
                                var sizeY = Math.ceil(ni.height());
                                img.hide();
                                tl.html('');
                                for (x = 0; x < 2; x++) {
                                    $("<div />").css({
                                        width: (ni.width()/2),
                                        height: sizeY,
                                        left: x * sizeX - (ni.width()/2),
                                        top: 0,
                                        backgroundPosition: "-" + (x * sizeX) + "px 0px",
                                        position:'absolute',
                                        'background-image': 'url(' +img.attr('src') +')'
                                    }).appendTo(tl);
                                }
                                tl.show().children(':eq(0)').animate({left:0 + "px"},o.transspeed).siblings('div').animate({left:ni.width()/2 + "px"},o.transspeed, function() {
                                    var tb = $(this);
                                    tb.parent().siblings('.activeItem').find('img').show();
                                    tl.hide();
                                    o.callback();
                                });
                                break;
                            case 'joinH':
                                var img = ni.find('img');
                                ni.show();
                                var sizeX = Math.ceil(ni.width());
                                var sizeY = Math.ceil(ni.height() + (ni.height()/2));
                                img.hide();
                                tl.html('');
                                for (y = 0; y < 2; y++) {
                                    $("<div />").css({
                                        width: sizeX,
                                        height: (ni.height()/2),
                                        left: 0,
                                        top: y * sizeY - (ni.height()/2),
                                        backgroundPosition: "-0px " + (y * sizeY) + "px",
                                        position:'absolute',
                                        'background-image': 'url(' +img.attr('src') +')'
                                    }).appendTo(tl);
                                }
                                tl.show().children(':eq(0)').animate({top:0 + "px"},o.transspeed).siblings('div').animate({top:ni.height()/2 + "px"},o.transspeed, function() {
                                    var tb = $(this);
                                    tb.parent().siblings('.activeItem').find('img').show();
                                    tl.hide();
                                    o.callback();
                                });
                                break;
                            case 'splitV':
                                li.css('z-index',5);
                                ni.css('z-index',1);
                                var img = li.find('img');
                                li.show();
                                ni.show();
                                var sizeX = Math.ceil(li.width()/2);
                                var sizeY = Math.ceil(li.height());
                                img.hide();
                                tl.html('');
                                for (x = 0; x < 2; x++) {
                                    $("<div />").css({
                                        width: sizeX,
                                        height: sizeY,
                                        left: x * sizeX,
                                        top: 0,
                                        backgroundPosition: "-" + (x * sizeX) + "px 0px",
                                        position:'absolute',
                                        'background-image': 'url(' +img.attr('src') +')'
                                    }).appendTo(tl);
                                }
                                tl.show().children(':eq(0)').animate({left:-sizeX + "px"},o.transspeed).siblings('div').animate({left:li.width() + "px"},o.transspeed, function() {
                                    var tb = $(this);
                                    tb.parent().siblings(o.itemSelector).css('z-index',1).hide().find('img').show();
                                    tb.parent().siblings('.activeItem').css('z-index',5).show();
                                    tl.hide();
                                    o.callback();
                                });
                                break;
                            case 'splitH':
                                li.css('z-index',5);
                                ni.css('z-index',1);
                                var img = li.find('img');
                                li.show();
                                ni.show();
                                var sizeX = Math.ceil(li.width());
                                var sizeY = Math.ceil(li.height()/2);
                                img.hide();
                                tl.html('');
                                for (y = 0; y < 2; y++) {
                                    $("<div />").css({
                                        width: sizeX,
                                        height: sizeY,
                                        left: 0,
                                        top: y * sizeY,
                                        backgroundPosition: "0px -" + (y * sizeY) + "px",
                                        position:'absolute',
                                        'background-image': 'url(' +img.attr('src') +')'
                                    }).appendTo(tl);
                                }
                                tl.show().children(':eq(0)').animate({top:-sizeY + "px"},o.transspeed).siblings('div').animate({top:li.height() + "px"},o.transspeed, function() {
                                    var tb = $(this);
                                    tb.parent().siblings(o.itemSelector).css('z-index',1).hide().find('img').show();
                                    tb.parent().siblings('.activeItem').css('z-index',5).show();
                                    tl.hide();
                                    o.callback()
                                });
                                break;
                            case 'opacity':
                            default:
                                ni.css('left','0px').hide().fadeIn(o.transspeed, function() {
                                    $(this).siblings(o.itemSelector).hide();
                                    o.callback();
                                });
                                break;
                        }
                        if(o.itemButtons) {
                            var ib;
                            if(o.itembuttonstarget) {
                                ib = $(o.itembuttonstarget).children('.itemButtons');
                            } else {
                                ib = g.children('.itemButtons');
                            }
                            ib.find('.itemButton').removeClass('activeButton');
                            ib.find('.itemButton[data-index="'+ni.attr('index')+'"]').addClass('activeButton');
                        }
                        if(o.resizable) {
                            if(ni.find('img'+o.imgSelector).length > 0) {
                                ni.css({width:'',height:''});
                            }
                            ni.css({height:''});
                            g.siblings('.rightButton, .leftButton').animate({ height:ni.outerHeight()},200);
                            if(ni.outerWidth() > 0 && ni.outerHeight() > 0) {
                                var ato = { height:ni.outerHeight() }
                                if(o.width!='auto') {
                                    ato.width = ni.outerWidth();
                                }
                                g.animate(ato,200);
                            }
                        }
                    }
                } else {
                    if(!ni.is(':animated') && !li.is(':animated')) {
                        waitingIndex = itemIndex;
                        g.prepend('<div class="loading"></div>');
                    }
                    if(!isNaN(i)) {
                        itemIndex = lastIndex;
                    }
                }
            }
        });
    };
    }) ($)
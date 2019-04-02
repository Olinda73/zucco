// $ = true
var s;
var lastScrollY = 0;
var touchscreen = false;
document.documentElement.className = "jsenabled"
$(document).ready(function() {
	
	$(window).resize(function(){resizeEvents();}).resize();
    $(document).bind('touchstart',function() {
        touchscreen = true;
    });
    
		if($('.article').length > 0 || $('article').length > 0){
	    $('article,.article').attr('data-center-top','@class:article onscreen').attr('data-center-bottom','@class:article').attr('data-bottom-top','@class:article').each(function() {
	        $(this).find('.transin').each(function(i) {
	            var a = $(this);
	            var delay = Number(a.css('transition-delay').replace('s',''));
	            a.css({'transition-delay': (delay + (i*0.1)) + 's'});
	        })
	    });
		}
		
		if($('.sideimage').length > 0){
    	$('.sideimage span, .sideimage > div').attr('data-top','@class:onscreen').attr('data-bottom','@class:onscreen').attr('data-1-bottom','@class: ').attr('data--1-top','@class: ');
		}
    
		if($('.bigtitle').length > 0){
			$('.bigtitle').attr('data-top','@class:bigtitle onscreen').attr('data-bottom','@class:bigtitle onscreen').attr('data-1-bottom','@class:bigtitle').attr('data--1-top','@class:bigtitle').each(function() {
	        var bt = $(this);
	        bt.data('endhtml',$.trim(bt.html()));
	    }).html('');
		}
		
		if($('.imagecell').length > 0){
	    $('.imagecell').find('img').each(function() {
	        var a = $(this);
	        a.parent().css({'background-image':'url('+this.src+')'});
	    });
		}
    
    $(window).bind('mousewheel DOMMouseScroll', validscroll);
    
		if($('#nav').length > 0){
    	$('#nav').find('ul').each(function() {
        $(this).children('li:not(:last)').after('<li class="space"></li>');
    	});
		}
	
	if($('#home').length > 0) {
		$('#nav').find('ul:first > li > a').addClass('smoothscroll');
	}
    
		if($('#progress').length > 0){
    	$('#progress').children().attr('data-center-center',"width:45px").attr('data-bottom-top',"width:6px").attr('data-top-bottom',"width:6px");
    }
		
    $('.burger').click(function() {
        $(this).parents('.nav').toggleClass('showNav');
    });
		
		
	
			
				$('.nav').mouseover(function(){
					if($(window).innerWidth() > 1200){
						$(this).addClass('showNav');
					}
				}).mouseout(function(){
					if($(window).innerWidth() > 1200){
						$(this).removeClass('showNav');
					}
				});
			
		
	setAutoText();
    $('.fancylink').swipebox();
		
	setupExpands($('body'));
		
	if($('.required').length > 0) {
		$('.required').blur(function() {
			$r = $(this);
			if($r.hasClass('email')) {
				var checkemail = this.value.match(/^[a-z0-9!#$%&'*+\-/=?^_`{|}~-]+(\.[a-z0-9!#$%&'*+\-/=?^_`{|}~-]+)*@[a-z0-9!#$%&'*+\-/=?^_`{|}~-]+(\.[a-zA-Z]+){1,2}/);
				if(!checkemail) {
					$r.parent().removeClass('valid').addClass('invalid');
				} else {
					$r.parent().removeClass('invalid').addClass('valid');
				}
			} else if(this.value === "") {
				$r.parent().removeClass('valid').addClass('invalid');
			} else {
				$r.parent().removeClass('invalid').addClass('valid');
			}
		});
	}
	
	$('.smoothscroll').unbind('click').click(function() {
		var $a = $(this);
		var $w = $(window);
		var ahref = $a.attr('href');
		targetid = ahref.substring(ahref.indexOf('#')+1, ahref.length);
		
		if($a.parents('#nav').length){
			$('.nav').removeClass('showNav');
		}
		
        if($('#'+targetid).length == 1) {
            if($('.menu-toggle').parent().hasClass('selected')) {
                $('.menu-toggle').click();
            }
        }
        if($a.hasClass('slow')) {
            scrollToId(targetid,3000);
        } else {
            scrollToId(targetid);
        }
		return false;
	});
	   
	/*$('.content, .imageline').find('img').attr('data-bottom-top','opacity:0').attr('data--15p-bottom-top','opacity:1').attr('data-top-bottom','opacity:0').attr('data-15p-top-bottom','opacity:1');*/
	
	$('.gallery').each(function() {
		var f = $(this);
		if(f.data('url')) {
			var furl = f.data('url');
			if(furl.indexOf('.xml') > -1) {
				loadSlideshowGalleryXml(f,furl,function() {
					f.imageGallery({transition:'left', autoplay:false, nextPrevButtons:true});
				});
			} else {
				f.load(f.data('url'), function() {
					f.imageGallery();
				});
			}
		} else {
			f.imageGallery();
		}
	});
		
	var navs = ['#nav'];
	
	for(var i = 0; i < navs.length; i++) {
		checkNav(navs[i]);
	}
    
    if(msie && parseInt(msie[1]) < 11) {
        $('body').addClass('lesserie');
    }
    
    setTimeout(function() {
        s = skrollr.init({
            forceHeight: false,
             mobileCheck: function() {
                if (/iP(hone|od|ad)/.test(navigator.platform)) {
                    var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                    var iosversion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
                    if (iosversion[0] < 8) {
                        if($('body').scrollTop() != 0) {
                            var scrolltop = $('body').scrollTop();
                            $('body').scrollTop(0);
                            if(typeof s == 'object') {
                                s.setScrollTop(scrolltop);
                            }
                        }
                        return true;
                    }
                }
                 return false;
             },
            render: function() {
                scrollEvent();
            }
        });
        scrollEvent();
    }, 200);
		
		
		$('#eventslisting').load('news/ajax.php');
		
});

var preventScroll
function validscroll(e){
    if(scriptedscroll || preventScroll) {
        e.preventDefault();
        return false;
    } else {
        if(scrollEvent(e.originalEvent.wheelDelta) == false) {
            e.preventDefault();
			preventScroll = true;
            return false;
        }
    }
}

$(window).load(function() {
    $('body').addClass('loaded');
});

function addTouchscrollY(target) {
	var ndragging;
	var nlastY = 0;
	var moved = false;
	target.unbind('mousedown touchstart').bind('mousedown touchstart', function(e) {
		ndragging = true;
		moved = false;
		nlastY = e.pageY;
		if(!nlastY) {
			var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
			nlastY = touch.pageY;
		}
	}).mouseleave(function() {
		if(ndragging) {
			$(this).trigger('mouseup');
			e.stopPropagation();
		}
	}).unbind('mouseup touchend').bind('mouseup touchend',function(e) {
		ndragging = false;
        //e.stopPropagation();
		//return false;
	}).unbind('mousemove touchmove').bind('mousemove touchmove',function(e) {
		if(ndragging) {
			var y = e.pageY;
			if(!y) {
				var touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
				y = touch.pageY;
			}
			
			var s = $(this);
			var newscroll = s.scrollTop() - (y-nlastY);
            if(newscroll >= 0 && newscroll <= s[0].scrollHeight - s.height()) {
				s.scrollTop(s.scrollTop() - (y-nlastY))
				nlastY = y;
				moved = true;
				e.stopPropagation();
			}
            e.stopPropagation();
            return false;
		}
	});
}

var finishedLastScroll = false;
var typing = false;
var typinginterval;
var typingdelay;
function scrollEvent(direction) {
    if(typeof s != "undefined") {
        if($('.bigtitle.onscreen').length > 0 && !typing) {
            typing = true;
            var bt = $('.bigtitle.onscreen');
            var bttarget = bt.data('endhtml');
            if(typingdelay) {
                clearTimeout(typingdelay);
            }
            $('.bigtitle').html('');
            $('.smallfoot').removeClass('display');
            typingdelay = setTimeout(function() {
                typinginterval = setInterval(function(){
                    var current = bt.html();
                    if(bt.html().length < bttarget.length) {
                         current = current.replace(/<\/span>$/,'');
                         var nextchar = bttarget.charAt(current.length);
                         if(nextchar != '<') {
                             bt.html(bttarget.substring(0,current.length+1));
                         } else {
                             bt.html(bttarget.substring(0,bttarget.indexOf('>',current.length+1) + 2));
                         }
                    } else {
                        $('.smallfoot').addClass('display');
                        if(typinginterval) {
                            clearInterval(typinginterval);
                        }
                    }
                },100);
            },2000);
        } else {
            if($('.bigtitle.onscreen').length == 0) {
                typing = false;
                if(typinginterval) {
                    clearInterval(typinginterval);
                }
                if(typingdelay) {
                    clearTimeout(typingdelay);
                }
                typingdelay = setTimeout(function() {
                    $('.bigtitle').html('');
                    $('.smallfoot').removeClass('display');
                },1000);
            }
        }
        
        if(!touchscreen || touchscreen && typeof direction == "number") {
            var w = window, a = 'inner';
            if (!('innerWidth' in window )) {
                a = 'client';
                w = document.documentElement || document.body;
            }
            var wwidth = w[a+'Width'];
            var wheight = w[a+'Height'];
        
             if(!scriptedscroll) {
                var top = $(window).scrollTop();
                var w = window, a = 'inner';
                if (!('innerWidth' in window )) {
                    a = 'client';
                    w = document.documentElement || document.body;
                }
                var wheight = w[a+'Height'];
                var currentsection = $('article.onscreen,.article.onscreen');
                if(currentsection.length == 0) {
                    currentsection = Array();
                    $('article,.article').each(function() {
                        var c = $(this);
                        if(top > c.offset().top && top + wwheight < c.offset().top) {
                            currentsection.push(c);
                        }
                    });
                    if(currentsection.length == 1) {
                        currentsection = currentsection[0];
                    } else {
                        currentsection = [];
                    }
                }
                if(currentsection.length == 1) {
                    var currentsectionpos = currentsection.offset();
                    if(typeof direction == "number") {
                        top -= direction/10;
                    }
                    if(top - 1 + wheight > currentsectionpos.top + currentsection.height() || (direction < 0 && currentsection.height() <= wheight)) {
                        if(currentsection.next('article,.article').length > 0) {
                            scrollToId(currentsection.next('article,.article').children(':first').attr('id'));
                            return false;
                        }
                    } else if(top + 1 < currentsectionpos.top || (direction > 0 && currentsection.height() <= wheight)) {
                        if(currentsection.prev('article,.article').length > 0) {
                            scrollToId(currentsection.prev('article,.article').children(':first').attr('id'), null, true);
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }
}
var scriptedscroll = false;
function scrollToId(targetid,duration,bottom) {
    if($('#'+targetid).length > 0 && scriptedscroll == false) {
        scriptedscroll = true;
        if(typeof duration != "number") {
            duration = 1000;
        }
        var targettop = $('#'+targetid).offset().top;
        var current = s.getScrollTop();
        var target = targettop;
        
        if(bottom) { 
            var w = window, a = 'inner';
            if (!('innerWidth' in window )) {
                a = 'client';
                w = document.documentElement || document.body;
            }
            target = $('#'+targetid).offset().top + $('#'+targetid).height() - w[a+'Height'];
        }
        
        $('#nav').find('.active').removeClass('active');
				
        
        jQuery({ Counter: current }).animate({ Counter:target }, {
            duration:duration,
            easing: 'linear',
            step: function () {
                s.setScrollTop(this.Counter);
            },
            complete:function() {
                s.setScrollTop(target);
                scriptedscroll = false;
				setTimeout(function() {
					preventScroll = false;
				},500);
            }
        });
    }
}

$(window).load(function() {
	$('.mobileview').parents('body').scrollTop(0);
	$('body').addClass('loaded');
	$(window).resize();
    
    if(s) {
        s.refresh();
    }
});

var galleryinterval;

function setupExpands(contain) {
	contain.find('.expand_head').unbind('click').click(function() {
		var $a = $(this);
		var $body = $a.next('.expand_body');
		if($a.hasClass('active')){
			$body.stop(true,true).animate({'height':'hide'},300);
			$a.removeClass('active');
		} else {
			$body.stop(true,true).animate({'height':'show'},300);
			$a.addClass('active');
		}
	}).filter(':not(.active)').siblings('.expand_body').hide();
}

function checkNav(sel) {
	var locat = location.href;
	var found = false;
	$(sel).find('a').each(function() {
		var myhref = this.href.replace('index.htm','');
		if(myhref == locat) {
			$(this).prepend('<span class="activelines"><span></span></span>').parents('li').addClass('active');
			found = true;
		}
	});
	function subhrefcheck() {
		var myhref = this.href.replace('index.htm','');
		if(myhref.match(regex)) {
			$(this).prepend('<span class="activelines"><span></span></span>').parents('li').addClass('active');
			found = true;
		}
	}
	if($('base').length > 0) {
	while(!found && locat.lastIndexOf('/') > $('base').attr('href').lastIndexOf('/')) {
		locat = locat.substring(0,locat.lastIndexOf('/'));
		regex = '^'+locat+'\/?$';
		$(sel).find('a').each(subhrefcheck);
	}
	}
	setTimeout(function() {
		$(sel).find('.active').addClass('activeanimate');
	},1000);
}

var msie = navigator.appVersion.match(/MSIE ([\d]+)/);
function resizeEvents() {
	if (/iP(hone|od|ad)/.test(navigator.platform)) {
        var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
        var iosversion = [parseInt(v[1], 10), parseInt(v[2], 10), parseInt(v[3] || 0, 10)];
        if (iosversion[0] < 8) {
            $('body').scrollTop(0);
        }
    }
    
    var w = window, a = 'inner';
	if (!('innerWidth' in window )) {
		a = 'client';
		w = document.documentElement || document.body;
	}
    var wwidth = w[a+'Width'];
    var wheight = w[a+'Height'];
    
    if(map) {
        map.setCenter(outletLocation);
    }
	
    if(typeof s == "object") {
		s.refresh();
	}
}
var closingmobile; 
var fixedTop = 0;
function mobileMenuDisplay(e) {
	anbtn = $(this);
	var navid = anbtn.parent().attr('data-navid');
	if(anbtn.parent().hasClass('selected')) {
		anbtn.parent().removeClass("selected");
		anbtn.siblings('div').slideUp(400);
	} else {
		$('.transnav').css({width:'0px'});
		anbtn.parent().addClass("selected");
		anbtn.siblings('div:not(.keephidden)').slideDown(400);
	}
	e.stopPropagation();
	e.preventDefault();
}

function stoppropagation(e) {
	e.stopPropagation();
}
var anbtn;
function navtouchstart(e) {
	var touch = e.originalEvent.touch || e.originalEvent.touches[0];
	tX = tstartX = touch.pageX;
	tY = tstartY = touch.pageY;
	e.stopPropagation();
}
function navtouchmove(e) {
	var item = $(this);
	var touch = e.originalEvent.touch || e.originalEvent.touches[0];
	tX = touch.pageX;
	tY = touch.pageY;
	e.stopPropagation();
}
function navtouchend(e) {
	if(tstartX && tX) {
		if(tX < tstartX - 20 || tX > tstartX + 20) {
			if(tX < tstartX - 20) {
				anbtn.click();
			}
		}
		tstartX = tstartY = tX = tY = false;
	}
}

function getSupportedTransform() {
	if(!msie || msie && msie[1] > 8) {
		var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
		for(var i = 0; i < prefixes.length; i++) {
			if(document.createElement('div').style[prefixes[i]] !== undefined) {
				return prefixes[i];
			}
		}
	}
    return false;
}

function setAutoText() {
	var i = document.createElement("input");
	if(typeof i.placeholder == 'undefined') {
		$('.autoText').blur(function() {
			var inp = $(this);
			if(inp.val() === "" || inp.val() == inp.attr('placeholder')) {
				inp.val(inp.attr('placeholder')).addClass('defaulted');
			}
		}).focus(function() {
			var inp = $(this);
			if(inp.val() == inp.attr('placeholder')) {
				inp.val('').removeClass('defaulted');
			}
		}).parents('form').submit(function() {
			$(this).find('.autoText').each(function() {
				$a = $(this);
				if($a.val() == $a.attr('placeholder')) {
					$a.val('');
				}
			});
		}).end().blur();
	}
}

(function($) {

$.fn.equalRowHeight = function(options) {
	var defaults = {
		
	};
	var o = $.extend(defaults, options);
	var tallest = [];
	$(this).height('');
	this.each(function(i) {
		if(o.rowLength) {
			tallest[Math.floor(i/o.rowLength)] = Math.max($(this).height(), tallest[Math.floor(i/o.rowLength)] || 0);
		} else {
			var a = $(this);
			var p = a.position();
			a.data('top',Math.floor(p.top))
			tallest[Math.floor(p.top)] = Math.max($(this).height(), tallest[Math.floor(p.top)] || 0);
		}
	}).each(function(i) {
		if(o.rowLength) {
			$(this).css({"height": tallest[Math.floor(i/o.rowLength)]});
		} else {
			var a = $(this);
			$(this).css({"height": tallest[Math.floor(a.data('top'))]});
		}
	});
	return this;
};
}) ($);

/* Gallery XML */
function loadSlideshowGalleryXml(slideshow, url, callback) {
	$('#headerplaceholder').remove();
	callback = callback || $.noop;
	var first = true;
	$.get(url, function(data){
		var dir = url.match(/(.*)\/.*$/)[1];
		
		var gal = $("document > gallery", data);
		var itemwidth = gal.attr('width');
		var itemheight = gal.attr('height');
		
		slideshow.html('');
		$("document > gallery > photo", data).each(function(){
			var caption = this.getAttribute("caption");
			if(!caption){
				caption = "";
			} else {
				if(caption.indexOf('"bottom"') > -1) {
					caption = '<div class="galleryText bottom"><div class="holder"><div class="back">' +caption + '</div></div></div>';
				} else {
					caption = '<div class="galleryText"><div class="holder"><div class="back">' +caption + '</div></div></div>';
				}
			}
			if(this.getAttribute("href")) {
				slideshow.append('<div class="galleryItem"><div class="back" style="background-image:url('+dir+'/'+this.getAttribute("src")+')"></div><div class="holder"><div class="viewport"><div class="image" style="background-image:url('+dir+'/'+this.getAttribute("src")+')"><a href="'+this.getAttribute("href")+'"><img src="'+dir+'/'+this.getAttribute("src")+'" alt="" /></a></div></div></div>'+caption+'</div>');
			} else {
				slideshow.append('<div class="galleryItem"><div class="back" style="background-image:url('+dir+'/'+this.getAttribute("src")+')"></div><div class="holder"><div class="viewport"><div class="image" style="background-image:url('+dir+'/'+this.getAttribute("src")+')"><img src="'+dir+'/'+this.getAttribute("src")+'" alt="" /></div></div></div>'+caption+'</div>');
			}
		});
		callback();
	});
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function gaclickevent(a, itemname, crossdomain) {
	if(a.href) {
		var targethref = a.href; 
		ga('send', 'event', 'button', 'click', itemname, {
			'hitCallback': function() {
				if(crossdomain) {
					ga(function(tracker) { 
						var linker = new window.gaplugins.Linker(tracker); 
						location.href = linker.decorate(targethref);
					}); 
				} else {
					document.location = targethref;
				}
			}
		}); 
	} else {
		ga('send', 'event', 'button', 'click', {
			'hitCallback': function() {
				if(crossdomain) {
					gasubmitevent(a.form);
				} else {
					a.form.submit();
				}
			}
		});
	}	
	return !ga.loaded;	
}

function gasubmitevent(myForm) {
	if(myForm.method == "post") {
		ga(function(tracker) {
			var linker = new window.gaplugins.Linker(tracker);
			myForm.action = linker.decorate(myForm.action);
			myForm.submit();
		});
	} else {
		ga(function(tracker) {
			var linkerParam = tracker.get('linkerParam').split('=');
			$(myForm).append('<input type="hidden" name="' + linkerParam[0] + '" value="'+linkerParam[1]+'" />');
			myForm.submit();
		});
	}
	return !ga.loaded;
}

var map;
var outletLocation = {lat: 51.4532255, lng: -2.5924453};
function initMap() {
    if($('#map').length > 0) {
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 11,
            center: outletLocation,
            disableDefaultUI: true,
            zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_BOTTOM
            },
                    styles: [
            { "elementType": "geometry", "stylers": [ { "color": "#f7f7f7" } ] },
            { "elementType": "labels.icon", "stylers": [ { "visibility": "off" } ] },
            { "elementType": "labels.text.fill", "stylers": [ { "color": "#858585" } ] },
            { "elementType": "labels.text.stroke", "stylers": [ { "color": "#f5f5f5" } ] },
            { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [ { "color": "#bdbdbd" } ] },
            { "featureType": "poi", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
            { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
            { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
            { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
            { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] },
            { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" } ] },
            { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#ffffff" } ] },
            { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#616161" } ] },
            { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] },
            { "featureType": "transit.line", "elementType": "geometry", "stylers": [ { "color": "#e5e5e5" } ] },
            { "featureType": "transit.station", "elementType": "geometry", "stylers": [ { "color": "#eeeeee" } ] },
            { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#ededed" } ] },
            { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#9e9e9e" } ] }
            ]
        });

       var marker = new google.maps.Marker({
            position: outletLocation,
            map: map,
            icon: 'presentation/location-marker.png',
            title: ''
        });
        $('.openmap').click(function(){
            $('.mapholder').addClass('active');
        });
        
        $('.mapholder').append('<div class="closemappop">X</div>');
        
        $('.closemappop').click(function(){
            $('.mapholder').removeClass('active');
        });
        
        $('#directionform').html('<form action="" id="directionsform"><input type="text" placeholder="Directions from..." id="mappostcode" /><button type="submit" class="colourbtn"><span><span>Get Directions</span></span></button></form>')
        var directionsOptions = { draggable: true }; 
        directionsDisplay = new google.maps.DirectionsRenderer(directionsOptions); 
        var directionsService = new google.maps.DirectionsService(); 
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel($('#directionscontainer')[0]);
        $('#directionsform').submit(function() {
            var start = $('#mappostcode')[0].value;
            if(start == "" || !start) {
                if(typeof navigator.geolocation == "object") {
                    navigator.geolocation.getCurrentPosition(function(result){
                        var lat = result.coords.latitude;
                        var long = result.coords.longitude;
                        var start = new google.maps.LatLng(lat,long);
                        getDirections(start);
                    }, function() {
                        alert("Please enter the postcode/area you are starting from");
                        pc.focus();
                    }, {
                        maximumAge: 300000
                    });
                } else {
                    alert("Please enter the postcode/area you are starting from");
                    pc.focus();
                }
			} else {
                getDirections(start);
            }
            return false;
        });
        function getDirections(start) {
            var request = { 
                origin:start,
                destination:outletLocation,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }; 
            directionsService.route(request, function(result, status) { 
                if (status == google.maps.DirectionsStatus.OK) { 
                    directionsDisplay.setDirections(result); 
                    location.hash = "directions";
                } else {
                    alert("Please check you have entered the correct postcode");
                }
            }); 
        }
    } else {
        $(function() {
						if($('#map').length > 0){
            	initMap();
						}
        })
    }
}
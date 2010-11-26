(function( jQuery ) {

/*
 * We are going to replace jQuery's internal animation logic.
 * This alternative logic will allow to switch between setInterval() and MozRequestAnimationFrame based one.
 */
var
  // We need a new internal timerId
  timerId,
  div = document.createElement('div');

// get rid of previous timerId
jQuery.fx.stop();

jQuery.fx.prototype.custom = function( from, to, unit ) {
  var self = this,
    fx = jQuery.fx;

  this.startTime = jQuery.now();
  this.start = from;
  this.end = to;
  this.unit = unit || this.unit || 'px';
  this.now = this.start;
  this.pos = this.state = 0;

  function t( gotoEnd ) {
    return self.step(gotoEnd);
  }

  t.elem = this.elem;

  if ( t() && jQuery.timers.push(t) && !timerId ) {
    timerId = (jQuery.support.frameInterval? setFrameInterval : setInterval)(fx.tick, fx.interval);
  }
  
  function setFrameInterval( cb ) {
    var toClear = function() {
      cb();
      window.mozRequestAnimationFrame();
    }
    window.addEventListener('MozBeforePaint', toClear, false);
    window.mozRequestAnimationFrame();
    return toClear;
  }
}

// create a new timerId using a dummy animation
jQuery(div).animate({top: 0}, 1);

jQuery.fx.stop = function() {
  (jQuery.support.frameInterval? clearFrameInterval : clearInterval)( timerId );
  timerId = null;
  
  function clearFrameInterval( toClear ) {
    window.removeEventListener('MozBeforePaint', toClear, false);
  }
};

/*
 * Widget code
 */
var
    $ = jQuery
  , $this = $(
      '<style>'+
        '#fpslet {'+
          'position: fixed;'+
          'top: 0px;'+
          'right: 0px;'+
          'width: 150px;'+
          'background: #141414;'+
          'color: #fff'+
        '}'+
        '#fpslet * {'+
          'font-size: 10px;'+
          'font-family: Arial,sans'+
        '}'+
        '#fpslet button {'+
          'padding: 0 3px'+
        '}'+
      '</style>'+ 
      '<table id="fpslet">'+
        '<tr>'+
          '<td>Interval</td>'+
          '<td>'+
            '<button>-</button><input type="text" size="3" style="text-align:center;" /><button>+</button>'+
          '</td>'+
        '</tr>'+
        '<tr>'+
          '<td>Theoritical</td>'+
          '<td> <span id="thFps">?</span> fps</td>'+
        '</tr>'+
        '<tr>'+
          '<td>Actual</td>'+
          '<td> <span id="acFps">?</span> fps</td>'+
        '</tr>'+
        '<tr style="display:none;">'+
          '<td title="mozPaintCount">mozPaint…</td>'+
          '<td> <span id="pcFps">?</span> pps</td>'+
        '</tr>'+
        '<tr style="display:none;">'+
          '<td colspan="2"><input type="checkbox" id="mraf" /><label title="use MozRequestAnimationFrame" for="mraf">MozRequestAnim…</label></td>'+
        '</tr>'+
      '</table>'
    ).appendTo(document.body)
  , $frameInterval = $this.find('input:first').attr('value', $.fx.interval)
  , $thFps = $('#thFps')
  , $acFps = $('#acFps')
  , $pcFps = $('#pcFps')
  , $mraf = $('#mraf')
  , i = 0, I = 1000
  , lastTime = Date.now()
  , lastPaintCount = window.mozPaintCount
  ;

// Update theoritical fps value
function thFps() {
  $thFps.text(Math.round(I /$.fx.interval));
}
thFps();
        
$this.find('button').bind('click', function() {
  $frameInterval.attr('value', +$frameInterval.attr('value') + (this.innerHTML == '+'? 1 : -1)).trigger('change');
});

// We need to recreate a timerId after each interval change
// see http://github.com/lrbabe/jquery.updateInterval
$frameInterval.bind('change', function() {
  var fx = $.fx;
  fx.interval = +this.value;
  fx.stop();
  $(div).animate({top: 0}, 1);
  thFps();
});

/*
 * x-browser fps counter
 * No guarantee that it is accurate since browsers could execute js but skip painting corresponding frame.
 * Apparently accurate, though. 
 */
$.fx.step.fps = function() {
  i++;
};
$acFps.animate({fps: 1}, I);
setInterval(function() {
  var 
      curTime = Date.now()
    , curPaintCount = window.mozPaintCount
    ;
  $acFps.html(Math.round(i/(curTime-lastTime)*1000)).stop().animate({fps: 1}, I);
  i = 0;
  
  // Mozilla specific paint counter.
  // accuratly counts painted frames, but the browser can paint frames more often than the js can process
  if (curPaintCount) {
    $pcFps.html(Math.round((curPaintCount - lastPaintCount)/(curTime-lastTime)*1000));
    lastPaintCount = curPaintCount;
  }
  
  lastTime = curTime;
}, I);

if (!!window.mozRequestAnimationFrame) {
  $.support.frameInterval = false;
  // Again, we need to recreate a timerId to switch animation logic
  $mraf.bind('click', function() {
    $.fx.stop();
    $.support.frameInterval = !$.support.frameInterval;
    $(div).animate({top: 0}, 1);
    
  });
  $this.find('tr:gt(2)').show();
}

})( jQuery );
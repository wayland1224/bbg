/*! jQuery倒计时插件 | 显示天数*/
(function($) {
  var countDown = function(item, config) {
    var seconds = parseInt($(item).attr(config.attribute)) - 1;
    var timer = null;
    var doWork = function() {
      if (seconds >= 0) {
        if (typeof(config.callback) == "function") {
          var data = {
            total: seconds,
            second: checkTime(Math.floor(seconds % 60)),
            minute: checkTime(Math.floor((seconds / 60) % 60)),
            hour: checkTime(Math.floor((seconds / 3600) % 24)),
            day: Math.floor(seconds / 86400)
          };
          config.callback.call(item, seconds, data, item);
        }
        seconds--;
      } else {
        window.clearInterval(timer);
      }
    };

    function checkTime(i) {
      if (i < 10) {
        i = "0" + i;
      }
      return i;
    }
    timer = window.setInterval(doWork, 1000);
    doWork();
  };
  var countDownConf = function() {
    var args = arguments;
    var config = {
      attribute: 'data-seconds',
      callback: null
    };
    if (args.length == 1) {
      if (typeof(args[0]) == "function") config.callback = args[0];
      if (typeof(args[0]) == "object") $.extend(config, args[0]);
    } else {
      config.attribute = args[0];
      config.callback = args[1];
    }
    $(this).each(function(index, item) {
      countDown.call(item, item, config);
    });
  };
  $.fn.countDown = countDownConf;
})(jQuery);

/*
 * 使用方法
 * $('.countDown').countDown(function(s, d){
 *   $(this).text(d.hour + ":" + d.minute + ":" + d.second);
 * });
 */

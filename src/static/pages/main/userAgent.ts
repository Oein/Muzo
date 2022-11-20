export let os: string = "";
export let ua = navigator.userAgent as string;

(function () {
  if (ua.match(/Win(dows )?NT 6\.0/)) {
    os = "Windows Vista";
  } else if (ua.match(/Win(dows )?(NT 5\.1|XP)/)) {
    os = "Windows XP";
  } else {
    if (ua.indexOf("Windows NT 5.1") != -1 || ua.indexOf("Windows XP") != -1) {
      os = "Windows XP";
    } else if (
      ua.indexOf("Windows NT 7.0") != -1 ||
      ua.indexOf("Windows NT 6.1") != -1
    ) {
      os = "Windows 7";
    } else if (
      ua.indexOf("Windows NT 8.0") != -1 ||
      ua.indexOf("Windows NT 6.2") != -1
    ) {
      os = "Windows 8";
    } else if (
      ua.indexOf("Windows NT 8.1") != -1 ||
      ua.indexOf("Windows NT 6.3") != -1
    ) {
      os = "Windows 8.1";
    } else if (
      ua.indexOf("Windows NT 10.0") != -1 ||
      ua.indexOf("Windows NT 6.4") != -1
    ) {
      os = "Windows 10";
    } else if (
      ua.indexOf("iPad") != -1 ||
      ua.indexOf("iPhone") != -1 ||
      ua.indexOf("iPod") != -1
    ) {
      os = "Apple iOS";
    } else if (ua.indexOf("Android") != -1) {
      os = "Android OS";
    } else if (ua.match(/Win(dows )?NT( 4\.0)?/)) {
      os = "Windows NT";
    } else if (ua.match(/Mac|PPC/)) {
      os = "Mac OS";
    } else if (ua.match(/Linux/)) {
      os = "Linux";
    } else if (ua.match(/(Free|Net|Open)BSD/)) {
      os = RegExp.$1 + "BSD";
    } else if (ua.match(/SunOS/)) {
      os = "Solaris";
    }
  }
  if (os.indexOf("Windows") != -1) {
    if (
      navigator.userAgent.indexOf("WOW64") > -1 ||
      navigator.userAgent.indexOf("Win64") > -1
    ) {
      os += " 64bit";
    } else {
      os += " 32bit";
    }
  }
})();

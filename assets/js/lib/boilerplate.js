//COBRAND

var cobrands = ["edilportale", "libero", "sky", "tiscali", "virgilio"];
var jsonpath = 'http://xx.json';
//jsonpath = '../../assets/json/cobrands.json';

var cid;
var cjson;

window.onload = function () {
  for (var i = 0; i < cobrands.length; i++) {
    if (window.location.href.indexOf(cobrands[i]+".") >= 0) {
      //load json
      cid = cobrands[i];
      loadJSON(jsonpath, function (data) {
        cjson=data.cobrand;
        addIframe(cjson, cid);
      }, function (xhr) {
        console.error(xhr);
      });
    }
  }
};

function addIframe(d, c){
  if(d[c].HeaderUrl!=""){
    var HContainer = document.createElement("IFRAME");
    HContainer.height = d[c].HeaderHeight;
    HContainer.width = "100%";
    HContainer.scrolling="no";
    HContainer.src= d[c].HeaderUrl;
    document.body.insertBefore(HContainer, document.body.firstChild);
  }
  if(d[c].FooterUrl!=""){
    var FContainer = document.createElement("IFRAME");
    FContainer.height = d[c].FooterHeight;
    FContainer.width = "100%";
    HContainer.scrolling="no";
    FContainer.src= d[c].FooterUrl;
    insertAfter(document.getElementsByTagName('footer')[0],FContainer);
  }
}

function loadJSON(path, success, error) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        if (success)
          success(JSON.parse(xhr.responseText));
      } else {
        if (error)
          error(xhr);
      }
    }
  };
  xhr.open("GET", path, true);
  xhr.send();
}

function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}


// COOKIE

function checkCobrand() {
  for (var i = 0; i < cobrands.length; i++) {
    if (window.location.href.indexOf(cobrands[i]+".") >= 0) {
      return true;
    }
  }
};

function createCookie(name, value, days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
  }
  else var expires = "";
  document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name, "", -1);
}

var cookieRegistry = [];

function listenCookieChange(cookieName, callback) {
  var id = setInterval(function() {
    if (cookieRegistry[cookieName]) {
      if (readCookie(cookieName) != cookieRegistry[cookieName]) {
        // update registry so we dont get triggered again
        cookieRegistry[cookieName] = readCookie(cookieName);
        return callback();
      }
    } else {
      cookieRegistry[cookieName] = readCookie(cookieName);
    }
  }, 500);
  return id;
}

(function() {

  var advCookie = "cc_advertising";

  if(readCookie(advCookie) !== "yes")
    createCookie(advCookie,"no");

  if(readCookie(advCookie) !== "yes"){

    var intervalId = listenCookieChange(advCookie, function(){

      opt = 1;
      if(readCookie(advCookie) === "yes"){

        if(checkCobrand() !== true) {
          opt = 0;
        }else{
          opt = 1;
        }
        clearInterval(intervalId);
      }
      if(typeof googletag !== 'undefined'){
        googletag.pubads().setCookieOptions(opt);
        googletag.pubads().refresh();
      }
    });

  }

})();

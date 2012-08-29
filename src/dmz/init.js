(function() {

var _cache = {}
  , _paths = []
  , _lastFoundPath = []
  , _globalConfig = {}
  , Log = function(name) { this.name = name; if (!this.name) { this.name = "?"; } }
  , log = new Log('init')
  ;

var logOut = function (level, name, message) {
   var value = level + (level !== '' ? ':' : '') + name + ':' + message;
   if (level === 'E') { console.error(value); }
   else if (level === 'W') { console.warn(value); }
   else { console.log(value); }
}

var formatMessage = function () {
   var result = ""
     , ix = 0
     , value
     , length = arguments.length
     ;
   for (ix = 0; ix < length; ix++) {
      if (ix > 0) { result = result + " "; }
      value = arguments[ix];
      if (typeof value === 'string') { result = result + value; }
      else {
         try { result = result + value.toString(); }
         catch (e) { result = result + e; }
      }
   }
   return result;
}

Log.prototype.out = function () {
   logOut("", this.name, formatMessage.apply(this, arguments));
}

Log.prototype.debug = function () {
   logOut("D", this.name, formatMessage.apply(this, arguments));
}

Log.prototype.info = function () {
   logOut("I", this.name, formatMessage.apply(this, arguments));
}

Log.prototype.warn = function () {
   logOut("W", this.name, formatMessage.apply(this, arguments));
}

Log.prototype.error = function () {
   logOut("E", this.name, formatMessage.apply(this, arguments));
}

var pushLastFoundPath = function (path) {
   if (typeof path !== 'string') { path = ""; }
   _lastFoundPath.push(path);
}

var getLastFoundPath = function () {
   return _lastFoundPath.length > 0 ? _lastFoundPath[_lastFoundPath.length - 1] : "";
}

var popLastFoundPath = function () { _lastFoundPath.pop(); }

var isUndefined = function (val) { var ud; return val === ud; };

var cleanPath = function (path, name) {

   var result = (path ? path + "/" : "") + name
     , place = 0
     , list
     ;
   if (!result.match(/[.]js$/)) {
      result += ".js";
   }

   result = result.replace(/\/{2,}/g, "/");
/*
   list = result.split("/");
   if (list.length > 1) {
      while (place < list.length)
         if (list[place] === "..") {
            if (place > 0) {
               list.splice(place - 1, 2);
            }
            else {

            }
         }
         else {
            place++;
         }
      }
   }
*/
   return result;
};

var checkCache = function (file) {

   var result
     , length = _paths.length
     , place = 0
     , done = false
     , fullname
     ;

   file = cleanPath("", file);

   result = _cache[file];

   while (!done && !result) {

      fullname = cleanPath(_paths[place], file);
      result = _cache[fullname];
      place++;
      if (place >= length) { done = true; }
   }

   return result;
};

var loadFile = function(path) {
   var result
     , xhr = new XMLHttpRequest()
     , error = false
     , done = false
     ;
   try {
      xhr.open("GET", path, false);
      xhr.send();
      if (xhr.status === 200) { result = xhr.responseText; }
   }
   catch (e) {
      log.error("Caught error getting", path, e);
   }

   return result;
};

var fetchScript = function (name) {
   var lastFoundPath = getLastFoundPath()
     , path = lastFoundPath
     , fullname = cleanPath(path, name)
     , file = loadFile(fullname)
     , result
     , ix = 0
     ;

   if (!file && lastFoundPath !== "") {
     path = "";
     fullname = cleanPath(path, name);
     file = loadFile(fullname);
   }

   while (!file && (ix < _paths.length)) {
      if (_paths[ix] !== lastFoundPath) {
         path = _paths[ix];
         fullname = cleanPath(path, name);
         file = loadFile(fullname);
      }
      ix++;
   }

   if (file) {
      result = {'file': file, 'path':path, 'fullname': fullname};
log.out("found", fullname);
   }

   return result;
};

var require = function (file) {

   var result = checkCache(file)
     , data
     , wrapped
     , func
     ;

   if (!result) {

      data = fetchScript(file);

      if (data && data.file && data.fullname && data.path) {

         pushLastFoundPath(data.path);
         _cache[data.fullname] = {};
         wrapped = "(function (require, exports) {" + data.file + "\n});";
         try {
            func = eval(wrapped);
            if (func) {
               func(require, _cache[data.fullname]);
               result = _cache[data.fullname];
            }
         }
         catch (e) {
            log.error("Failed loading:", data.fullname, "Reason:", e);
         }
         popLastFoundPath();
      }
   }

   return result;
};

var fetchPlugin = function (name) {
   var fullname = cleanPath("", name)
     , result = loadFile(fullname)
     , ix = 0
     ;

   while (!result && (ix < _paths.length)) {
      fullname = cleanPath(_paths[ix], name);
      result = loadFile(fullname);
      ix++;
   }
if(result) { log.out("found", fullname); }
   return result;
}

var loadPlugins = function (plugins) {

   var length = 0
     , ix = 0
     , wrapped
     ;

   if (typeof plugins === 'string') { plugins = [plugins]; }

   if (!(Array.isArray(plugins))) {
      throw new Error("Invalid aruments passed into loadPlugins.");
   }

   length = plugins.length;

   for (ix = 0; ix < length; ix++) {
      script = fetchPlugin(plugins[ix]);
      if (typeof script === 'string') {
         wrapped = '(function (require, self) {' + script + '\n});';
         try {
            func = eval(wrapped);
            if (func) {
               func(require, {'log': new Log(plugins[ix])});
            }
         }
         catch (e) {
            log.error("Error loading:", plugins[ix], "Reason:", e);
         }
      }
   }
};

var merge = function (target, data) {
   var list = Object.keys(data)
     , ix
     , key
     ;

   for (ix = 0; ix < list.length; ix++) {
      key = list[ix];
      if (isUndefined(target[key])) {

      }
      else if (Array.isArray(target[key])) {

      }
      else if (typeof target[key] === 'object') {

      }
   }
}

var setupFunctions = function () {
   var result = false
     , xhr = new XMLHttpRequest()
     ;
   try {
      xhr.open('GET', '/DMZDEVSERVER', false);
      xhr.send();
      if (xhr.status === 200) { result = true; }
   }
   catch (e) {
      log.error("Caught error getting getting dmz Dev Server info", e);
   }
   log.info("Dev Server:", result);
   return result;
};

var init = function () {
   var pathname = window.location.pathname
     , value
     , place
     , root = '/'
     , fileName = 'index'
     , fileExt = '.html'
     , manifest
     , data
     , ix
     , file
     , config
     ;

   setupFunctions();

   if (typeof pathname === 'string') {
      place = pathname.lastIndexOf('/');
      if (place >= 0) {
         root = pathname.slice(0, place + 1);
         if (place < (pathname.length - 1)) {
            fileName = pathname.slice(place + 1);
            place = fileName.lastIndexOf('.');
            if (place > 0) {
               fileExt = fileName.slice(place);
               fileName = fileName.slice(0, place);
            }
         }
      }
   }

   manifest = loadFile('dmz_manifest_' + fileName + '.json');

   if (typeof manifest === 'string') {
      try {
         data = JSON.parse(manifest);
      }
      catch (e) {
      }
   }
   else { log.error("Failed to load manifest: dmz_manifest_" + fileName + ".json"); }

   if (data) {
      if (Array.isArray(data.paths)) {
         _paths = data.paths;
      }
      else if (typeof data.paths === 'string') {
         _paths = [data.paths];
      }

      ix = 0;
      while (ix < _paths.length) {
         if (typeof _paths[ix] !== 'string') {
            _paths.splice(ix, 1);
         }
         else {
            value = _paths[ix];
            if (value.charAt(value.length - 1) !== '/') {
               _paths[ix] = value + '/';
            }
            ix++;
         }
      }

      for (ix = 0; ix < _paths.length; ix++) {
      }

      if (Array.isArray(data.config)) {
         for (ix = 0; ix < data.config.length; ix++) {
/*
            file = loadFile(data.config[ix]);
            config = JSON.parse(file);
            merge(_globalConfig, config);
*/
         }
      }

      if (Array.isArray(data.plugins)) {
         loadPlugins(data.plugins);
      }
   }
};

init();

})();

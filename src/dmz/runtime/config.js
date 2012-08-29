var util = require('dmz/types/util')
  , vector = require('dmz/types/vector')
  , matrix = require('dmz/types/matrix')
  , createError = util.createError
  , Config = function () { this.state = {}; }
  , splitPath
  , findLeaf
  ;

splitPath = function (path) {
   var result = []
     , place = 0;
     ;
   if (typeof path === 'string') {
      result = path.split('.');
   }

   for (place = 0; place < result.length; place++) {
      result[place] = result[place].trim();
   }

   return result;
};

findLeaf = function (path, place, node) {
   var result =[]
     , name = path[place]
     , ix
     , item
     ;

   for (ix = 0; ix < node.length; ix++) {
      item = node[ix];
      if (util.isDefined(item[name])) {
         if (Array.isArray(item[name])) {
            result = result.concat(item[name]);
         else {
            result.push(item[name]);
         }
      }
   }

   if (result.length !== 0) {
      if (place < (path.length - 1)) {
         result = findLeaf(path, place + 1, result);
      }
   }

   return result;
};


exports.isTypeOf = function (value) {

   return Config.prototype.isPrototypeOf(value) ? value : undefined;
};


exports.create = function () {

   var result = new Config();
   if (arguments.length > 0) { result.set.apply(result, arguments); }
   return result;
};


Config.prototype.create = exports.create;


Config.prototype.set = function () {

};


Config.prototype.copy = function () {

   return this.create(this.state);
};


Config.prototype.toString = function () {

   return JSON.stringify(this.state);
};

Config.prototype.attribute = function (path, value) {

};


Config.prototype.add = function (path, value) {

};


Config.prototype.get = function (path) {

   var pathList = splitPath(path)
     , result
     ;

   return result;
};


Config.prototype.bool = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;

   return result;
};


Config.prototype.string = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;

   return result;
};


Config.prototype.number = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;

   return result;
};


Config.prototype.vector = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;

   return result;
};


Config.prototype.matrix = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;

   return result;
};


Config.prototype.objectType = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;
};


Config.prototype.eventType = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;
};


Config.prototype.message = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;
};


Config.prototype.namedHandle = function (path, value) {

   var pathList = splitPath(path)
     , result = value
     ;
};


(function() {
  var app;

  app = angular.module("imgurUpload", []);

  app.service("imgurUpload", ["$q", function($q) {
    var clientId;
    clientId = null;
    return {
      setClientId: function(id) {
        return clientId = id;
      },
      upload: function(file, options) {
        var deferred, fd, ref, xhr;
        if (options == null) {
          options = {};
        }
        deferred = $q.defer();
        clientId = options.clientId || clientId;
        if (clientId == null) {
          deferred.reject("No clientId");
          return deferred.promise;
        }
        if (file == null) {
          deferred.reject("No file");
          return deferred.promise;
        }
        if (!options.canvas && !(file != null ? (ref = file.type) != null ? ref.match(/image.*/) : void 0 : void 0)) {
          deferred.reject("File not image");
          return deferred.promise;
        }
        xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.imgur.com/3/image.json");
        xhr.setRequestHeader("Authorization", "Client-ID " + clientId);
        xhr.upload.addEventListener('progress', function(event) {
          var percent;
          percent = parseInt(event.loaded / event.total * 100);
          return deferred.notify(percent);
        }, false);
        if (!options.canvas) {
          if (typeof FormData === "undefined" || FormData === null) {
            deferred.reject("Browser doesn't support FormData");
            return deferred.promise;
          }
          fd = new FormData();
          fd.append("image", file);
          xhr.send(fd);
        }
        if (options.canvas) {
          xhr.send(file);
        }
        xhr.onerror = deferred.reject;
        xhr.onload = function() {
          var result;
          result = JSON.parse(xhr.responseText);
          return deferred.resolve(result);
        };
        return deferred.promise;
      }
    };
  }]);

}).call(this);

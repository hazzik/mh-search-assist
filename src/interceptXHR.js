export function interceptXHR(url, handler) {
  (function (open) {
    XMLHttpRequest.prototype.open = function (...args) {
      if (args[1].includes(url)) {
        this.addEventListener("load", function () {
          const json = handler(JSON.parse(this.responseText));
          Object.defineProperty(this, "responseText", { writable: true });
          this.responseText = JSON.stringify(json);
        }, false);
      }
      open.apply(this, args);
    };
  })(XMLHttpRequest.prototype.open);
}

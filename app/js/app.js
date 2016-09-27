var App = function () {
   this.view = {
      constructor: function () {
         console.log('Hello worls');
      }
   }
   this.view.constructor();
};
$(document).ready(App);

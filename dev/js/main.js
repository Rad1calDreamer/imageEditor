window.onload = function() {
   var app = new Vue({
      el: '#imageEditor',
      data: {
         sourceImage: '',
         canvas: null
      },
      methods: {
         onFileChange: function(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
               return;
            }
            this.createImage(files[0]);
         },
         loadCanvas: function() {
            this.canvas = new fabric.Canvas(document.getElementById('canvas'), {});
            var bg = new fabric.Image(document.getElementById('sourceImage'), {
               width: 300,
               height: 150
            });
            this.canvas.add(bg).renderAll();
         },
         createImage: function(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = function(e) {
               vm.sourceImage = e.target.result;
               vm.loadCanvas();
            };
            reader.readAsDataURL(file);
         },
         removeImage: function(e) {
            this.sourceImage = '';
         }
      }
   });
};
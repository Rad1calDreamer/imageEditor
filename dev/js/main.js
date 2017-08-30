window.onload = function() {
   var app = new Vue({
      el: '#imageEditor',
      data: {
         sourceImage: '',
         canvas: null,
         width: 300,
         height: 150
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
            this.canvas = new fabric.Canvas(document.getElementById('canvas'), {
               width: this.width,
               height: this.height
            });
            var bg = new fabric.Image(document.getElementById('sourceImage'), {
               width: this.width,
               height: this.height
            });
            this.canvas.add(bg).renderAll();
         },
         createImage: function(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = function(e) {
               image.onload = function() {
                  vm.width = this.naturalWidth;
                  vm.height = this.naturalHeight;
                  vm.loadCanvas();
               };
               vm.sourceImage = image.src = e.target.result;
            };
            reader.readAsDataURL(file);
         },
         removeImage: function(e) {
            this.sourceImage = '';
         },
         saveImage: function() {
            if (!this.canvas) {
               return;
            }
            this.canvas.lowerCanvasEl.toBlob(function(blob) {
               saveAs(blob, 'pretty image.png');
            });

         }
      }
   });
};
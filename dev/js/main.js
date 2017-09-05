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
            this.createCanvas();
            this.createImage(files[0]);

         },
         loadImage: function() {
            var bg = new fabric.Image(document.getElementById('sourceImage'), {
               width: this.width,
               height: this.height,
               selectable: false
            });
            this.canvas.clear().add(bg).renderAll();
         },
         createImage: function(file) {
            var image = new Image();
            var reader = new FileReader();
            var vm = this;

            reader.onload = function(e) {
               image.onload = function() {
                  vm.width = this.naturalWidth;
                  vm.height = this.naturalHeight;
                  vm.createCanvas();
                  vm.setCanvasSize(vm.width, vm.height);
                  vm.loadImage();
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
         },
         createCanvas: function() {
            if (!this.canvas) {
               this.canvas = new fabric.Canvas(document.getElementById('canvas'), {});
            }

         },
         setCanvasSize: function(width, height) {
            this.canvas && this.canvas.setDimensions({
               width: width,
               height: height
            });
         }

      }
   });
   var panel = new Vue({
      el: '#commandPanel',
      data: {
         tools: [
            {
               icon: 'icon icon-arrow-up-right2 commandPanel__item',
               id: 'arrow',
               title: 'Arrow'
            },
            {
               icon: 'icon icon-checkbox-unchecked commandPanel__item',
               id: 'rect',
               title: 'Rectangle'
            },
            {
               icon: 'icon icon-font-size commandPanel__item',
               id: 'Text',
               title: 'Text'
            },
            {
               icon: 'icon icon-pencil2 commandPanel__item',
               id: 'freedraw',
               title: 'Freedraw'
            },
            {
               icon: 'icon icon-crop commandPanel__item',
               id: 'crop',
               title: 'crop'
            },
            {
               icon: 'icon icon-scissors commandPanel__item',
               id: 'scissors',
               title: 'Scissors'
            },
            {
               icon: 'icon icon-droplet commandPanel__item',
               id: 'blur',
               title: 'Blur'
            }
         ]

      }

   });
};
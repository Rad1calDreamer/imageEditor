window.onload = function() {
   const EventBus = new Vue({
      created() {
         this.$on('my-event', this.handleMyEvent);
      },
      methods: {
         handleMyEvent($event) {
            console.log('My event caught in global event bus', $event);
         }
      }
   });
   Object.defineProperties(Vue.prototype, {
      $bus: {
         get: function() {
            return EventBus;
         }
      }
   });

   var app = new Vue({
      el: '#imageEditor',
      data: {
         sourceImage: '',
         canvas: null,
         width: 300,
         height: 150
      },
      created() {
         this.$bus.$on('onToolClick', (tool, state) => {
            this.toolClick(tool, state);
            let canvas = this.canvas,
               origX, origY, rect, newObj, _drawHandler;
            canvas.on('mouse:down', function(option) {
               if (option.target && (option.target.selectable || option.target.isEditing)) {
                  return null;
               } else {
                  let pointer = canvas.getPointer(option.e);
                  origX = pointer.x;
                  origY = pointer.y;
                  newObj = true;
                  rect = new fabric.Rect({
                     left: origX,
                     top: origY,
                     width: pointer.x - origX,
                     height: pointer.y - origY,
                     fill: 'transparent',
                     stroke: 'red',
                     strokeWidth: 6
                  });

                  canvas.add(rect);
                  _drawHandler = function(option) {
                     if (option.e.touches && option.e.touches.length > 1) {
                        return;
                     }
                     let pointer = canvas.getPointer(option.e);
                     if (origX > pointer.x) {
                        rect.setLeft(pointer.x);
                     }
                     if (origY > pointer.y) {
                        rect.setTop(pointer.y);
                     }
                     rect.setWidth(Math.abs(origX - pointer.x));
                     rect.setHeight(Math.abs(origY - pointer.y));
                     rect.setCoords();
                     canvas.renderAll();
                  };
                  canvas.on('mouse:move', _drawHandler);
               }
            });

            canvas.on('mouse:up', function() {
               canvas.off('mouse:move', _drawHandler);
            });


         });
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
         },
         onToolClick: function() {
            console.log(arguments);
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
               title: 'Arrow',
               state: false
            },
            {
               icon: 'icon icon-checkbox-unchecked commandPanel__item',
               id: 'rect',
               title: 'Rectangle',
               state: false
            },
            {
               icon: 'icon icon-font-size commandPanel__item',
               id: 'Text',
               title: 'Text',
               state: false
            },
            {
               icon: 'icon icon-pencil2 commandPanel__item',
               id: 'freedraw',
               title: 'Freedraw',
               state: false
            },
            {
               icon: 'icon icon-crop commandPanel__item',
               id: 'crop',
               title: 'crop',
               state: false
            },
            {
               icon: 'icon icon-scissors commandPanel__item',
               id: 'scissors',
               title: 'Scissors',
               state: false
            },
            {
               icon: 'icon icon-droplet commandPanel__item',
               id: 'blur',
               title: 'Blur',
               state: false
            }
         ]

      },
      methods: {
         toolClick: function(name, state) {
            this.$bus.$emit('onToolClick', name, state);
            var toolIdx = this.tools.findIndex(function(element) {
               return element.title === name;
            });
            this.tools[toolIdx].state = !state;
         }
      }

   });
};
window.onload = function() {

   let panel = {
      data: function() {
         return {
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
         };
      },
      methods: {
         toolClick: function(name) {
            let state;
            this.tools.forEach(function(element) {
               if (element.title === name) {
                  state = element.state = !element.state;
               } else {
                  element.state = false;
               }
            });
            this.$emit('tool:click', name, state);
         }
      },
      template: '<div class="commandPanel"><div v-for="tool in tools"  v-bind:class="[tool.icon, {active:tool.state}]" v-bind:title="tool.title" @click="toolClick(tool.title)" ></div></div>'
   };
// class="{{tool.icon}}"
   let editor = new Vue({
      el: '#main',
      data: {
         sourceImage: '',
         canvas: null,
         width: 300,
         height: 150,
         _bgImage: {}
      },
      created() {
         // this.$bus.$on('onToolClick', (tool, state) => {
         //    this.toolClick(tool, state);
         //    let canvas = this.canvas,
         //       origX, origY, rect, newObj, _drawHandler;
         //    canvas.on('mouse:down', function(option) {
         //       if (option.target && (option.target.selectable || option.target.isEditing)) {
         //          return null;
         //       } else {
         //          let pointer = canvas.getPointer(option.e);
         //          origX = pointer.x;
         //          origY = pointer.y;
         //          newObj = true;
         //          rect = new fabric.Rect({
         //             left: origX,
         //             top: origY,
         //             width: pointer.x - origX,
         //             height: pointer.y - origY,
         //             fill: 'transparent',
         //             stroke: 'red',
         //             strokeWidth: 6
         //          });
         //
         //          canvas.add(rect);
         //          _drawHandler = function(option) {
         //             if (option.e.touches && option.e.touches.length > 1) {
         //                return;
         //             }
         //             let pointer = canvas.getPointer(option.e);
         //             if (origX > pointer.x) {
         //                rect.setLeft(pointer.x);
         //             }
         //             if (origY > pointer.y) {
         //                rect.setTop(pointer.y);
         //             }
         //             rect.setWidth(Math.abs(origX - pointer.x));
         //             rect.setHeight(Math.abs(origY - pointer.y));
         //             rect.setCoords();
         //             canvas.renderAll();
         //          };
         //          canvas.on('mouse:move', _drawHandler);
         //       }
         //    });
         //
         //    canvas.on('mouse:up', function() {
         //       canvas.off('mouse:move', _drawHandler);
         //    });
         //
         //
         // });
      },
      methods: {
         onFileChange: function(e) {
            let files = e.target.files || e.dataTransfer.files;
            if (!files.length) {
               return;
            }
            this.createCanvas();
            this.createImage(files[0]);

         },
         loadImage: function() {
            let bg = new fabric.Image(document.getElementById('sourceImage'), {
               width: this.width,
               height: this.height,
               selectable: false
            });
            this.canvas.clear().setBackgroundImage(bg).renderAll();
         },
         createImage: function(file) {
            let image = new Image();
            let reader = new FileReader();
            let vm = this;

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
               this.canvas = new fabric.Canvas(document.getElementById('canvas'), {
                  preserveObjectStacking: true,
                  controlsAboveOverlay: true,
                  rotationCursor: 'pointer',
                  defaultCursor: 'default',
                  hoverCursor: 'move',
                  selection: false,
                  targetFindTolerance: 15,
                  renderOnAddRemove: true,
                  allowTouchScrolling: false,
                  enableRetinaScaling: true,
                  background: this._bgImage
               });
            }

         },
         setCanvasSize: function(width, height) {
            this.canvas && this.canvas.setDimensions({
               width: width,
               height: height
            });
         },
         onToolClick: function(name, state) {
            if (!state) {
               this.canvas.deactivateAllWithDispatch().renderAll();
               this.canvas.isDrawingMode = false;
               this.canvas.off('mouse:down', this._mouseDownHandler);
               this.canvas.off('mouse:up', this._mouseUpHandler);
               this.canvas.off('mouse:move', this._mouseMoveHandler);
            } else {
               switch (name) {
                  case 'Rectangle':
                     let canvas = this.canvas,
                        origX, origY, rect, newObj;

                     this._mouseDownHandler = function(option) {
                        if (option.target && (option.target.selectable || option.target.isEditing)) {
                           editor.newObj = newObj = false;
                           return null;
                        } else {
                           const pointer = canvas.getPointer(option.e);
                           canvas.selection = false;
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
                              strokeWidth: 12,
                              transparentCorners: false
                           });
                           editor.newObj = rect;
                           /*todo shadow*/
                           canvas.add(rect);
                           self._mouseMoveHandler = function(option) {
                              const pointer = canvas.getPointer(option.e);
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
                           canvas.on('mouse:move', self._mouseMoveHandler);
                        }
                     };
                     canvas.on('mouse:down', this._mouseDownHandler);
                     this._mouseUpHandler = function() {
                        canvas.off('mouse:move', self._mouseMoveHandler);
                        canvas.selection = false;
                        canvas.setActiveObject(rect);
                     };
                     canvas.on('mouse:up', this._mouseUpHandler);
                     break;
               }
            }
         },
         _mouseDownHandler: function() {
         },
         _mouseUpHandler: function() {
         },
         _mouseMoveHandler: function() {
         }

      },
      components: {
         panel: panel
      }
   });

};
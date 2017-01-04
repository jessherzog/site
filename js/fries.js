     (function() {
          var image = { // back and front images
/*                'back': { 'url':'../img/mr_ketchup.png', 'img':null }, */
               'back': { 'url':'../img/ketchup+istock copy.png', 'img':null },
               'front': { 'url':'http://i.stack.imgur.com/STEuc.png', 'img':null }
          };
          var canvas = {'temp':null, 'draw':null}; // temp and draw canvases
          var mouseDown = false;
      
     function getLocalCoords(elem, ev) {
          var ox = 0, oy = 0;
          var first;
          var pageX, pageY;
          while (elem != null) {
               ox += elem.offsetLeft;
               oy += elem.offsetTop;
               elem = elem.offsetParent;
          }
          if (ev.hasOwnProperty('changedTouches')) {
               first = ev.changedTouches[0];
               pageX = first.pageX;
               pageY = first.pageY;
          } else {
               pageX = ev.pageX;
               pageY = ev.pageY;
          }
          return { 'x': pageX - ox, 'y': pageY - oy };
     }
      
     function recompositeCanvases() {
          var main = document.getElementById('maincanvas');
          var tempctx = canvas.temp.getContext('2d');
          var mainctx = main.getContext('2d');
 
          canvas.temp.width = canvas.temp.width;
          tempctx.drawImage(canvas.draw, 0, 0);
          tempctx.globalCompositeOperation = 'source-atop';
          tempctx.drawImage(image.back.img, 0, 0);
          mainctx.drawImage(image.front.img, 0, 0);
          mainctx.drawImage(canvas.temp, 0, 0);
     }
      
     function scratchLine(can, x, y, fresh) {
          var ctx = can.getContext('2d');
          ctx.lineWidth = 8;
          ctx.lineCap = ctx.lineJoin = 'round';
          ctx.strokeStyle = '#f00'; // can be any opaque color
          if (fresh) {
               ctx.beginPath();
               ctx.moveTo(x+0.01, y);
          }
          ctx.lineTo(x, y);
          ctx.stroke();
     }
      
     function setupCanvases() {
          var c = document.getElementById('maincanvas');
          c.width = image.back.img.width;
          c.height = image.back.img.height;
          canvas.temp = document.createElement('canvas');
          canvas.draw = document.createElement('canvas');
          canvas.temp.width = canvas.draw.width = c.width;
          canvas.temp.height = canvas.draw.height = c.height;
      
          recompositeCanvases();
           
          function mousedown_handler(e) {
               var local = getLocalCoords(c, e);
               mouseDown = true;
               scratchLine(canvas.draw, local.x, local.y, true);
               recompositeCanvases();
               if (e.cancelable) { 
                    e.preventDefault(); 
               }
               return false;
          };
      
          function mousemove_handler(e) {
               if (!mouseDown) { return true; }
               var local = getLocalCoords(c, e);
               scratchLine(canvas.draw, local.x, local.y, false);
               recompositeCanvases();
               if (e.cancelable) { e.preventDefault(); }
               return false;
          };
      
          /**
           * On mouseup.  (Listens on window to catch out-of-canvas events.)
           */
          function mouseup_handler(e) {
               if (mouseDown) {
                    mouseDown = false;
                    if (e.cancelable) { e.preventDefault(); }
                    return false;
               }
               return true;
          };
 
          c.addEventListener('mousedown', mousedown_handler, false);
          c.addEventListener('touchstart', mousedown_handler, false);

          window.addEventListener('mousemove', mousemove_handler, false);
          window.addEventListener('touchmove', mousemove_handler, false);

          window.addEventListener('mouseup', mouseup_handler, false);
          window.addEventListener('touchend', mouseup_handler, false);
     }
      
     function loadingComplete() {
          var loading = document.getElementById('loading');
          var main = document.getElementById('main');
          loading.className = 'hidden';
          main.className = '';
     }
      
     function loadImages() {
          var loadCount = 0;
          var loadTotal = 0;
          var loadingIndicator;
          function imageLoaded(e) {
               loadCount++;
               if (loadCount >= loadTotal) {
                    setupCanvases();
                    loadingComplete();
               }
          } 
          for (k in image) if (image.hasOwnProperty(k))
               loadTotal++;
          for (k in image) if (image.hasOwnProperty(k)) {
               image[k].img = document.createElement('img'); // image is global
               image[k].img.addEventListener('load', imageLoaded, false);
               image[k].img.src = image[k].url;
          }
     }
      
     window.addEventListener('load', function() {
          var resetButton = document.getElementById('resetbutton'); 
          loadImages();
          resetButton.addEventListener('click', function() {
               // clear the draw canvas
               canvas.draw.width = canvas.draw.width;
               recompositeCanvases()
               return false;
          }, false);
     }, false);
      
     })();
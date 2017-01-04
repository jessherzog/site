// used for the racing ant ♡
// can def be improved ~ ...

var tab_word; 

function tab() {
  tab_word = document.getElementById('wordwrap');
  return tab_word;
};

tab();

(function() {
  function createContext(width, height) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    canvas.width = width, canvas.height = height;
    return context;
  }

  function getImageData(image) {
    var context = createContext(image.width, image.height);
    context.drawImage(image, 0, 0);
    return context.getImageData(0, 0, image.width, image.height);
  }

  function createOutlineMask(srcImageData, threshold) {
    var srcData = srcImageData.data;
    var width = srcImageData.width, height = srcImageData.height;

    function get(x, y) {
      if (x < 0 || x >= width || y < 0 || y >= height) return;
      var offset = ((y * width) + x) * 4;
      return srcData[offset + 3];
    }

    var context = createContext(width, height);
    var dstImageData = context.getImageData(0, 0, width, height);
    var dstData = dstImageData.data;

    function set(x, y, value) {
      var offset = ((y * width) + x) * 4;
      dstData[offset + 0] = value;
      dstData[offset + 1] = value;
      dstData[offset + 2] = value;
      dstData[offset + 3] = 0xFF;
    }

    function match(x, y) {
      var alpha = get(x, y);
      return alpha == null || alpha >= threshold;
    }

    function isEdge(x, y) {
      return !match(x-1, y-1) || !match(x+0, y-1) || !match(x+1, y-1) ||
             !match(x-1, y+0) ||      false       || !match(x+1, y+0) ||
             !match(x-1, y+1) || !match(x+0, y+1) || !match(x+1, y+1);
    }

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        if (match(x, y) && isEdge(x, y)) {
          set(x, y, 0x00);
        } else {
          set(x, y, 0xFF);
        }
      }
    }

    return dstImageData;
  }

  function ant(x, y, offset) {
    return ((6 + y + offset % 12) + x) % 12 > 6 ? 0x00 : 0xFF;
  }

  function renderMarchingAnts(imageData, outlineMask, antOffset) {
    var data = imageData.data;
    var width = imageData.width, height = imageData.height;
    var outline = outlineMask.data;

    for (var y = 0; y < height; y++) {
      for (var x = 0; x < width; x++) {
        var offset = ((y * width) + x) * 4;
        var isEdge = outline[offset] == 0x00;

        if (isEdge) {
          var value = ant(x, y, antOffset);
          data[offset + 0] = value;
          data[offset + 1] = value;
          data[offset + 2] = value;
          data[offset + 3] = 0xFF;
        } else {
          data[offset + 3] = 0x00;
        }
      }
    }
    return imageData;
  }
  
  function extractText(canvas) {
    var el = document.createElement("span");
    el.innerHTML = canvas.innerHTML;
    tab_word.innerHTML = el.textContent;
    var text = el.textContent;
    canvas.innerHTML = "";
    // console.log(el.innerHTML);
    return text.trim();
  }

  function getFontStyle(element) {
    var style = document.defaultView.getComputedStyle(element, null);
    return style.font || ("" +
      (style.fontStyle   || "normal") + " " +
      (style.fontVariant || "normal") + " " +
      (style.fontWeight  || "normal") + " " +
      (style.fontSize    || "medium") + "/" +
      (style.lineHeight  || "normal") + " " +
      (style.fontFamily  || "sans-serif")
    );                          
  }

  function measureText(text, font) {
    var span = document.createElement("span");
    span.style.font = font;
    span.style.whiteSpace = "nowrap";
    span.style.visibility = "hidden";
    span.appendChild(document.createTextNode(text));
    document.body.appendChild(span);
    var rect = span.getBoundingClientRect();
    document.body.removeChild(span);
    return { width: rect.width, height: rect.height };
  }
  
  function drawText(context, text, font) {
    var canvas = context.canvas;
    var dimensions = measureText(text, font);
    canvas.width = dimensions.width + 2;
    canvas.height = dimensions.height + 2;
    context.font = font;
    context.textBaseline = "top";
    context.fillText(text, 1, 1);
  }

  function ants(canvas) {
    var context = canvas.getContext("2d");
    var text = extractText(canvas);      
    var font = getFontStyle(canvas);
    drawText(context, text, font);

    var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    var outlineMask = createOutlineMask(imageData, 0xC0);
    var offset = 0;

    setInterval(function() {
      context.putImageData(renderMarchingAnts(imageData, outlineMask, offset -= 2), 0, 0);
    }, 167);
  };
  ants(document.getElementById("wordwrap"));
}).call(this);
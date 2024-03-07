import { useEffect, useState } from "react";

export const useAvarageColor = (img, div) => {
  const [rgb, setRgb] = useState(null);
  console.log(img)
  
  function analyse(img, border) {
    var canvas = document.createElement("canvas"),  // create a canvas element
        ctx = canvas.getContext("2d"),              // get context
        w = img.naturalWidth,                       // get actual width..
        h = img.naturalHeight;
    
    canvas.width = w;                               // set canvas size
    canvas.height = h;
    
    ctx.drawImage(img, 0, 0);                       // draw in image
    
    // do checks:, for example:
    //if (border*2 > canvas.width || border*2 > canvas.height) throw "Image too small!";
    
    // get borders, avoid overlaps (though it does not really matter in this case):
    var top = ctx.getImageData(0, 0, w, border).data;
    var left = ctx.getImageData(0, border, border, h - border*2).data;
    var right = ctx.getImageData(w - border, border, border, h - border*2).data;
    var bottom = ctx.getImageData(0, h - border, w, border).data;
    
    var r = 0, g = 0, b = 0, cnt = 0;
    
    // count pixels and add up color components: (see function below)
    countBuffer(top);
    countBuffer(left);
    countBuffer(right);
    countBuffer(bottom);
    
    // calc average
    r = (r / cnt + 0.5)|0;
    g = (g / cnt + 0.5)|0;
    b = (b / cnt + 0.5)|0;
    
    return "rgb(" + r + "," + g + "," + b + ")";
    
    function countBuffer(data) {
      var i = 0, len = data.length;
      while(i < len) {
          r += data[i++];   // add red component etc.
          g += data[i++];
          b += data[i++];
          i++;
          cnt++;            // count one pixel
      }
    }
    
  }

  useEffect(() => {
    if (img) setRgb(analyse(img,5));
  }, [img]);

  return  {rgb};
};

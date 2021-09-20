/* modified from here: https://gist.github.com/olvado/1048628/d8184b8ea695372e49b403555870a044ec9d25d0 */

function update(){
  let char = document.getElementById('text_input').value;
  let fg = document.getElementById('text_color').value;
  let bg = document.getElementById('background_color').value;
  let font = document.getElementById('font').value;

  let avr_rgb = average_rgb(char, fg, bg, font);
  let avr_rgb_input = document.getElementById('avr_rgb');
  let b_or_w = (avr_rgb.r * 0.299 + avr_rgb.g * 0.587 + avr_rgb.b * 0.114) > 186 ? '#000' : '#FFF';
  let hex = rgbToHex(avr_rgb.r, avr_rgb.g, avr_rgb.b);

  avr_rgb_input.style.backgroundColor = "rgb(" + avr_rgb.r + "," + avr_rgb.g + "," + avr_rgb.b + ")";
  avr_rgb_input.style.color = b_or_w;
  avr_rgb_input.innerHTML = "rgb(" + avr_rgb.r + "," + avr_rgb.g + "," + avr_rgb.b + ") / " + hex;
  console.log(avr_rgb);
}

function componentToHex(c) {
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function average_rgb(char, fg, bg, font) {
  let canvas = document.getElementById('text_canvas'),
      context = canvas.getContext && canvas.getContext('2d'),
      rgb = {r:102,g:102,b:102}, // Set a base colour as a fallback for non-compliant browsers
      pix_int = 1, //how many pixes to do, 1 will do all, 2 will do every other etc.
      count = 0,
      i = -4,
      data, length;

  if (!context) { alert('Your browser does not support CANVAS'); return rgb; }

  context.clearRect(0, 0, canvas.width, canvas.height);

  context.font = font;
  let height_metrics = context.measureText('█'); //so we always get the same height, since text is kinda unreliable.

  let metrics = context.measureText(char);
  let width = metrics.width;
  let height = height_metrics.actualBoundingBoxAscent + height_metrics.actualBoundingBoxDescent;

  canvas.height = height;
  canvas.width = width;

  context.fillStyle = bg;
	context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = fg;
  context.textBaseline = 'middle';
  context.font = font;
  context.fillText(char, 0, (canvas.height / 2) - 2);

  try {
    data = context.getImageData(0, 0, canvas.width, canvas.height);
  } catch(e) {
    // catch errors - usually due to cross domain security issues
    alert(e);
    return rgb;
  }

  while ((i += pix_int * 4) < data.data.length) {
    count++;
    rgb.r += data.data[i];
    rgb.g += data.data[i+1];
    rgb.b += data.data[i+2];
  }

  rgb.r = Math.floor(rgb.r/count);
  rgb.g = Math.floor(rgb.g/count);
  rgb.b = Math.floor(rgb.b/count);

  return rgb;
}

update();

// helpful view-source:http://studio.html5rocks.com/samples/dnd-fileapi/index.html
// TODO (screen and) print css for the pdf export
// TODO make the entire screen droppable
// TODO just do the right thing with whatever files are dropped
// TODO structure app/modules e.g. http://css-tricks.com/how-do-you-structure-javascript-the-module-pattern-edition/
// TODO add examples from /fixtures to index.html


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Doordecs = {

  settings: {
  },

  init: function() {
    this.bindUIActions();
    Doordecs.message = document.getElementById('doordecs-message');
  },

  bindUIActions: function() {
    document.body.addEventListener('dragenter', Doordecs.onDragEnter);
    document.body.addEventListener('dragover', Doordecs.onDragOver);
    document.body.addEventListener('dragleave', Doordecs.onDragLeave);
    document.body.addEventListener('drop', Doordecs.onDrop, false);
  },

  residents: [],
  bgImg: new Image(),
  message: null,
  buildButton: null,
  imageReady: false,
  residentsReady: false,

  readCSVFile: function(file) {
    var reader = new FileReader();
    reader.onerror = function(e) {
      console.log('error code: ' + e.target.error.code);
    };

    // create closure to capture file information
    reader.onload = (function(aFile) {
      return function(evt) {
        Doordecs.residents = d3.csv.parse(evt.target.result);
        console.log(Doordecs.residents);
      };
    }(file));

    // read in the image file as a data url
    reader.readAsText(file);
  },

  readImageFile: function(file, elm) {
    var reader = new FileReader();
    reader.onerror = function(e) {
      alert('error code: ' + e.target.error.code);
    };

    // create closure to capture file information
    reader.onload = (function(aFile) {
      return function(evt) {
        Doordecs.bgImg.src = evt.target.result;
        //while (elm.hasChildNodes()) {
        //    elm.removeChild(elm.lastChild);
        //}
        //elm.appendChild(im);
        //elm.style.backgroundImage = 'url(' + Doordecs.bgImg.src + ')';
      };
    }(file));

    // read in the image file as a data url
    reader.readAsDataURL(file);
  },

  onDragEnter: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  onDragOver: function(e) {
    e.stopPropagation();
    e.preventDefault();
    document.body.setAttribute('id', 'drag-over');
  },

  onDragLeave: function(e) {
    e.stopPropagation();
    e.preventDefault();
    document.body.setAttribute('id', '');
  },

  onDrop: function(e) {
    e.stopPropagation();
    e.preventDefault();
    document.body.setAttribute('id', '');

    // loop over list of dropped files
    var files = e.dataTransfer.files;
    var imageType = /image.*/;
    for (var i = 0, file; file = files[i]; i++) {

      if (file.type.match(imageType)) {
        Doordecs.readImageFile(file, this);
        Doordecs.imageReady = true;
      } else {  // TODO error handle this!
        Doordecs.readCSVFile(file);
        Doordecs.residentsReady = true;
      }
    }

    // update message
    if (Doordecs.residentsReady && Doordecs.imageReady) {
      Doordecs.message.textContent = 'Perfect! Building your door decorations...';
      setTimeout(Doordecs.build, 2000);
    } else if (!Doordecs.residentsReady && !Doordecs.imageReady) {
      Doordecs.message.textContent = 'Drag a list of your residents and an image onto this page.';
    } else if (Doordecs.residentsReady && !Doordecs.imageReady) {
      Doordecs.message.textContent = 'Nice! Now drop an image too...';
    } else if (!Doordecs.residentsReady && Doordecs.imageReady) {
      Doordecs.message.textContent = 'Nice! Now drop a list of your residents too...';
    }

    return false;
  },

  build: function() {
    console.log('building...');
    var canvas = null,
        bgImg = Doordecs.bgImg,
        residents = Doordecs.residents,
        name_region_h = 80,
        room_region_h = 40,
        ul_print = document.createElement('ul'),
        im, li;
    var display = document.getElementById('display-door-decs'),
        print = document.getElementById('print-door-decs');
    print.appendChild(ul_print);

    residents.forEach(function(resident) {
      console.log(resident.first);

      // set up canvas
      canvas = document.createElement('canvas');
      canvas.width = 440;
      canvas.height = 264;
      ctx = canvas.getContext('2d');

      // background
      ctx.drawImage(bgImg, 0, 0);
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, room_region_h);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, canvas.height-name_region_h, canvas.width, name_region_h);
      ctx.globalAlpha = 1;

      // name on the bottom
      ctx.font = '64px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(resident.first, canvas.width/2, canvas.height-name_region_h/2);

      // room number up top
      ctx.font = '24px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(resident.room, canvas.width-60, 24);

      // save print image
      li = document.createElement('li');
      img = document.createElement('img');
      im = canvas.toDataURL('image/png');
      img.setAttribute('src', im);
      li.appendChild(img);
      ul_print.appendChild(li);

      // save display image
      img = document.createElement('img');
      im = canvas.toDataURL('image/png');
      img.setAttribute('src', im);
      rotate = getRandomInt(-30, 30);
      rLeft = getRandomInt(-110, 110);
      rTop = getRandomInt(-20, 100);
      img.style.webkitTransform = "rotate("+rotate+"deg) scale(0.8)";
      img.style.top = "" + rTop + "px";
      img.style.left = "" + rLeft + "px";
      display.appendChild(img);

    });
    Doordecs.message.textContent = 'Done! Head to print preview :)';
  }

};

(function() {
  Doordecs.init();
})();

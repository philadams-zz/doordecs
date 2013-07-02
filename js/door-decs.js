// TODO based on view-source:http://studio.html5rocks.com/samples/dnd-fileapi/index.html
// TODO have built images show up rotated; print grid
//      - rotate them back in print css?
//      - just create two lists, one for screen and the other for print?
// TODO (screen and) print css for the pdf export

var DoorDecs = {

    residents: [],
    bgImg: new Image(),

    readCSVFile: function(file) {
        var reader = new FileReader();
        reader.onerror = function(e) {
            console.log('error code: ' + e.target.error.code);
        };

        // create closure to capture file information
        reader.onload = (function(aFile) {
        return function(evt) {
            DoorDecs.residents = d3.csv.parse(evt.target.result);
            console.log(DoorDecs.residents);
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
                DoorDecs.bgImg.src = evt.target.result;
                //while (elm.hasChildNodes()) {
                //    elm.removeChild(elm.lastChild);
                //}
                //elm.appendChild(im);
                elm.style.backgroundImage = 'url(' + DoorDecs.bgImg.src + ')';
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
        this.style.backgroundColor = 'red';
    },

    onDragLeave: function(e) {
        e.stopPropagation();
        e.preventDefault();
        this.style.backgroundColor = 'white';
    },

    onDrop: function(e) {
        e.stopPropagation();
        e.preventDefault();

        // loop over list of dropped files
        var files = e.dataTransfer.files;
        var imageType = /image.*/;
        for (var i = 0, file; file = files[i]; i++) {

            if (file.type.match(imageType)) {
                DoorDecs.readImageFile(file, this);
            } else {  // TODO error handle this!
                DoorDecs.readCSVFile(file);
            }
        }

        return false;
    },

    buildDoorDecs: function(e) {
        console.log('building...');
        var canvas = null,
            bgImg = DoorDecs.bgImg,
            residents = DoorDecs.residents,
            name_region_h = 80,
            room_region_h = 40,
            ul_display = document.createElement('ul'),
            ul_print = document.createElement('ul'),
            im, li;
        var display = document.getElementById('display-door-decs'),
            print = document.getElementById('print-door-decs');
        display.appendChild(ul_display);
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
            li = document.createElement('li');
            img = document.createElement('img');
            im = canvas.toDataURL('image/png');
            img.setAttribute('src', im);
            li.style.webkitTransform = "rotate(-22deg)";
            li.appendChild(img);
            ul_display.appendChild(li);

        });

        e.stopPropagation();
        e.preventDefault();
    }

};


// set up droppable regions
var dropboxes = Array.prototype.slice.call(
  document.getElementsByClassName('dropbox'));
dropboxes.forEach(function(elm) {
    elm.addEventListener('dragenter', DoorDecs.onDragEnter);
    elm.addEventListener('dragover', DoorDecs.onDragOver);
    elm.addEventListener('dragleave', DoorDecs.onDragLeave);
    elm.addEventListener('drop', DoorDecs.onDrop, false);
});

// set up button onclick
var buildButton = document.getElementById("build-button");
buildButton.addEventListener('click', DoorDecs.buildDoorDecs);

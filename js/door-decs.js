var residents = [];
var canvas = document.createElement('canvas');

var loadImage = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var image = new Image();
    var ctx = canvas.getContext('2d');

    // handle file onload
    reader.onload = function(fh) {
        return function(e) {
            var fileContents = e.target.result;
            console.log('loading image data...');
            image.src = fileContents;
            canvas.setAttribute('width', image.width);
            canvas.setAttribute('height', image.height);
            ctx.drawImage(image, 0, 0);
            console.log('...image drawn to canvas');
            canvas.style.setProperty('display', 'block');
        };
    }(file);
    reader.readAsDataURL(file);
};

var loadResidentData = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    // handle file onload
    reader.onload = function(fh) {
        return function(e) {
            var fileContents = e.target.result;
            residents = d3.csv.parse(fileContents);
            console.log('data for ' + residents.length + ' residents loaded');
            console.log(residents);
        };
    }(file);
    reader.readAsText(file);
    return residents;
};

var buildDoorDecs = function(event) {
    console.log('building...');
    var bufferedImData = null;
    var doordecs = document.getElementById('door-decs');
    var ctx = canvas.getContext('2d');
    var name_region_h = 80;
    var room_region_h = 40;
    var im, li, img;
    ctx.globalAlpha = 0.4;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, room_region_h);
    ctx.globalAlpha = 0.6;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, canvas.height-name_region_h, canvas.width, name_region_h);
    ctx.globalAlpha = 1;
    bufferedImData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    residents.forEach(function(resident) {
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

        // save image and restore canvas state
        im = canvas.toDataURL('image/png');
        li = document.createElement('li');
        img = document.createElement('img');
        img.setAttribute('src', im);
        li.appendChild(img);
        doordecs.appendChild(li);
        ctx.putImageData(bufferedImData, 0, 0);
        setTimeout('', 2000);  // hackishly let image data finish resetting

    });

    console.log('built!');
    var buildDD = document.getElementById('build-door-decs');
    var showDD = document.getElementById('show-door-decs');
    buildDD.style.setProperty('display', 'none');
    showDD.style.setProperty('display', 'block');
    return false;
};


// adding event handlers
document.getElementById('residents-file').addEventListener('change', loadResidentData, false);
document.getElementById('image-file').addEventListener('change', loadImage, false);
document.getElementById('build-button').addEventListener('click', buildDoorDecs, false);

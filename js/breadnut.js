var loadImage = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    var image = new Image();
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // handle file onload
    reader.onload = function(fh) {
        return function(e) {
            var fileContents = e.target.result;
            image.src = fileContents;
            canvas.setAttribute('width', image.width);
            canvas.setAttribute('height', image.height);
            ctx.drawImage(image, 20, 20);
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
            console.log(fileContents);
            var data = d3.csv.parse(fileContents);
            console.log(data);
        };
    }(file);
    reader.readAsText(file);
};

// adding event handlers
document.getElementById('residents-file').addEventListener('change', loadResidentData, false);
document.getElementById('image-file').addEventListener('change', loadImage, false);

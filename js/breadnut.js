var handleResidentData = function(event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsText(file);

    // handle file onload
    reader.onload = function(fh) {
        return function(e) {
            var fileContents = e.target.result;
            console.log(fileContents);
            var data = d3.csv.parse(fileContents);
            console.log(data);
        };
    }(file);
};

document.getElementById('residents-file').addEventListener('change', handleResidentData, false);

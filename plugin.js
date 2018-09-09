
var extension = new window.RemixExtension();

function do_post(url, data, cb) {
  fetch(url, {
    method: 'post',
    body: JSON.stringify(data)
  }).then(function(response) {
    console.log("response", response);
    response.json().then(function (r) {
      cb(r);
    });
  });
}

window.onload = function() {
  console.log("LOADED");
  extension.listen('compiler', 'compilationFinished', function (result) {
    console.log("GOT A COMPILE: ");
    console.log(result);
  });

  document.querySelector('input#manticore').addEventListener('click', function () {
    var div = document.querySelector('div#results');
    div.innerHTML = "Please wait...";
    extension.call('compiler', 'getCompilationResult', [],
    function (error, result ) {
      console.log(error, result);
      document.querySelector('div#results').innerHTML = "Sending compile info to server. Please wait...";

      // fetch results
      do_post('/manticore', result, function(res) {
        console.log("got result");
        console.log(res);
        if(res['status'] == 0) {
          console.log("error from manticore");
          document.querySelector('div#results').innerHTML = 'Error running Manticore: ' + res['output'];
        }
        else {
          document.querySelector('div#results').innerHTML = res['output'];
        }
      });
     });
  });

  document.querySelector('input#mythril').addEventListener('click', function () {
    var div = document.querySelector('div#results');
    div.innerHTML = "Please wait...";
    extension.call('compiler', 'getCompilationResult', [],
    function (error, result ) {
      console.log(error, result);
      document.querySelector('div#results').innerHTML = "Sending compile info to server. Please wait...";

      // fetch results
      do_post('/mythril', result, function(res) {
        console.log("got result");
        console.log(res);
        if(res['status'] == 0) {
          console.log("error from myth");
          document.querySelector('div#results').innerHTML = "Error running mythril: " + res['output'];
        }
        else {
          document.querySelector('div#results').innerHTML = "Mythril results: " + res['output'];
        }
      });

     });
  });
  document.querySelector('input#slither').addEventListener('click', function () {
    var div = document.querySelector('div#results');
    div.innerHTML = "Please wait...";
    extension.call('compiler', 'getCompilationResult', [],
    function (error, result ) {
      console.log(error, result);
      document.querySelector('div#results').innerHTML = "Sending compile info to server. Please wait...";

      // fetch results
      do_post('/slither', result, function(res) {
        console.log("got result");
        console.log(res);
        if(res['status'] == 0) {
          console.log("error from slither");
          document.querySelector('div#results').innerHTML = "Error running slither: " + res['output'];
        }
        else {
          document.querySelector('div#results').innerHTML = "Slither results: " + res['output'];
        }
      });

     });
  });
}


/*
test contract creation
*/
var addrResolverByteCode = '0x6060604052341561000f57600080fd5b33600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061033c8061005f6000396000f300606060405260043610610062576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806338cc483114610067578063767800de146100bc578063a6f9dae114610111578063d1d80fdf1461014a575b600080fd5b341561007257600080fd5b61007a610183565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156100c757600080fd5b6100cf6101ac565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561011c57600080fd5b610148600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506101d1565b005b341561015557600080fd5b610181600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610271565b005b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561022d57600080fd5b80600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161415156102cd57600080fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550505600a165627a7a723058201b23355f578cb9a23c0a43a440ab2631b62df7be0a8e759812a70f01344224da0029'

const addrResolverTx = {
  gasLimit: '0x2710',
  from: '0xca35b7d915458ef540ade6068dfe2f44e8fa733c',
  data: addrResolverByteCode,
  value: '0x00',
  useCall: false
}
var extension = new window.RemixExtension();

function do_post(url, data, cb) {
  fetch(url, {
    method: 'post',
    body: JSON.stringify(data)
  }).then(function(response) {
    console.log("response", response);
    response.json().then(function (r) {cb(r)});
    //return cb(response.json());
  });

}
window.onload = function () {
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
          return;
        }

        document.querySelector('div#results').innerHTML = res['output'];
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
          return;
        }
        else {
          document.querySelector('div#results').innerHTML = res['output'];
        }

      });

     });
  });
/*
  setInterval(function () {
    extension.call('app', 'detectNetWork', [], function (error, result) {
      console.log(error, result)
    })
  }, 5000)

  document.querySelector('input#testmessageadd').addEventListener('click', function () {
    extension.call('config', 'setConfig', [document.getElementById('filename').value, document.getElementById('valuetosend').value],
    function (error, result) { console.log(error, result) })
  })

  document.querySelector('input#testmessageremove').addEventListener('click', function () {
    extension.call('config', 'removeConfig', [document.getElementById('filename').value],
    function (error, result) { console.log(error, result) })
  })

  document.querySelector('input#testmessagerget').addEventListener('click', function () {
    extension.call('config', 'getConfig', [document.getElementById('filename').value],
    function (error, result) { console.log(error, result) })
  })

  document.querySelector('input#testcontractcreation').addEventListener('click', function () {
    extension.call('udapp', 'runTx', [addrResolverTx],
    function (error, result) { console.log(error, result) })
  })

  document.querySelector('input#testaccountcreation').addEventListener('click', function () {
    extension.call('udapp', 'createVMAccount', ['71975fbf7fe448e004ac7ae54cad0a383c3906055a75468714156a07385e96ce', '0x56BC75E2D63100000'],
    function (error, result) { console.log(error, result) })
  })

  var k = 0
  document.querySelector('input#testchangetitle').addEventListener('click', function () {
    extension.call('app', 'updateTitle', ['changed title ' + k++],
    function (error, result) { console.log(error, result) })
  })
  */
}

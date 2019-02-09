const wcontroller = (function() {
  let procesedData = [];
  //[{1:[0:0, 1:1, 2:2..]}]
  let jobQueue;
  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let numberLimits;

  function generateBtn() {
    procesedData = [];
    jobQueue = _generateJobQueue(document.getElementById("tableSize").value);
    numberLimits = jobQueue.length;
    _generateWorkers(document.getElementById("workersAmount").value);
  }

  function _generateJobQueue(numTop) {
    return Array.from(new Array(numTop - 1), (val, index) => index + 1);
  }

  function _generateWorkers(numWorkers) {
    const workers = [];

    for (let i = 0; i < numWorkers; ++i) {
      const worker = new Worker("./workers/worker.js");
      workers.push(worker);
      worker.addEventListener("message", _workerJobFinished);
      _asingNewJob(worker);
    }

    /* return new Promise((resolve, reject) => {
      worker.onmessage = result => {
        resolve(result);
      };
    }); */
  }

  function _workerJobFinished(result) {
    console.log("job finished:", result.data);
    procesedData.push(JSON.parse(result.data));
    _generateTable();
    if (jobQueue.length === 0) {
      return _killWorker(result.target);
    }

    _asingNewJob(result.target);
  }

  function _asingNewJob(worker) {
    worker.postMessage({ numBase: jobQueue.shift(), limit: numberLimits });
  }

  function _killWorker(worker) {
    worker.terminate();
  }

  function _generateTable() {
    const aaaa = document.getElementById("tableContent");

    const table = procesedData.reduce((acc, act) => {
      const row = act.result.reduce(
        (acc, act) => (acc += `<td>${act}</td>`),
        ""
      );
      return (acc += `<tr> ${row} </tr>`);
    }, "");

    aaaa.innerHTML = "<table>" + table + "</table>";
    console.log("Print done");
  }

  return { generateBtn };
})();

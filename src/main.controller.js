const wcontroller = (function() {
  let procesedData = [];
  //[{1:[0:0, 1:1, 2:2..]}]
  let jobQueue;
  // [1, 2, 3, 4, 5, 6, 7, 8, 9]
  let numberLimits;
  let workersNumber;
  const performanceTime = { start: 0, end: 0 };

  function generateBtn() {
    document.getElementById("totalGenerateTime").innerHTML = "Generating...";
    performanceTime.start = performance.now();
    procesedData = [];
    jobQueue = _generateJobQueue(document.getElementById("tableSize").value);
    workersNumber = document.getElementById("workersAmount").value;
    numberLimits = jobQueue.length;
    _generateWorkers(workersNumber);
  }

  function _generateJobQueue(numTop) {
    return Array.from(new Array(numTop - 1), (val, index) => index + 1);
  }

  function _generateWorkers(numWorkers) {
    const workers = [];

    for (let i = 0; i < numWorkers; ++i) {
      const worker = new Worker("./workers/worker.js?name=#" + i);
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
    workersNumber -= 1;
    if (!workersNumber) {
      _allJobFinished();
    }
  }

  function _allJobFinished() {
    performanceTime.end = performance.now();
    document.getElementById(
      "totalGenerateTime"
    ).innerHTML = `Generated in ${performanceTime.end -
      performanceTime.start} ms`;
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
  }

  return { generateBtn };
})();

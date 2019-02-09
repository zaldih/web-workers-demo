self.addEventListener("message", d => {
  const calculated = calculate(d.data.numBase, d.data.limit);
  self.postMessage(JSON.stringify(calculated));
});

function calculate(numBase, limit) {
  let toReturn = { base: numBase, result: [], worker: self };
  for (let i = 1; i < limit; ++i) {
    toReturn.result.push(numBase * i);
  }

  return toReturn;
}

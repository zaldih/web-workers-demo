self.addEventListener("message", d => {
  const calculated = calculate(d.data.numBase, d.data.limit);
  self.postMessage(JSON.stringify(calculated));
});

function calculate(numBase, limit) {
  let data = { base: numBase, result: [], worker: self };
  for (let i = 1; i < limit; ++i) {
    data.result.push(numBase * i);
  }

  return data;
}

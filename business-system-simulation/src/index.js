'use strict'
const fs = require('fs');
const log_file = fs.createWriteStream(__dirname + '/../logs/demo-app.log', {flags : 'w'});
const log_stdout = process.stdout;

const randomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms)=>new Promise(res => setTimeout(res, ms));

console.mon = function(d, service='app', level='info') { //
  const mess = typeof(d)==="string" ? d : `<event>${JSON.stringify(d)}</event>`;
  const out = `${new Date().toISOString()} [${service}] ${level}: ${mess}\n`;
  log_file.write(out);
  log_stdout.write(out);
};


async function emulateWork(){
  const processOrder = function (orderId, employee_id, sku_count, sku_weight, sku_volume){
    const orderObjAssembly = {
      source: 'WMS',
      event: 'order_assembly_start',
      data: {
        order_id: orderId,
        employee_id,
        sku_count,
        sku_weight,
        sku_volume
      }
    }
    console.mon(orderObjAssembly);
    orderObjAssembly.event = 'order_assembly_end';
    orderObjAssembly.data = {order_id: orderId}
    setTimeout(()=>console.mon(orderObjAssembly), randomInteger(1,10)*1000);
  }

  let iteration = 0;
  while (true){
    console.mon(`iteration ${++iteration}`);
    //orderId, employee_id, sku_count, sku_weight, sku_volume
    processOrder(iteration, randomInteger(1,10), randomInteger(1,50), randomInteger(100,1000), randomInteger(1000,10000));
    await sleep(1000);
  }
}
emulateWork();
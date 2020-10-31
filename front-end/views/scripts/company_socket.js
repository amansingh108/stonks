let company = document.getElementById('company-name').innerHTML.trim()

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.splice(0,1)
    chart.data.datasets.forEach((dataset) => {
        dataset.data.splice(0,1)
    });
    chart.update();
}

window.onload = function(){

  counter = 0
  //set limit of visible graph points
  limit = 5
  draw_chart([],[],(chart)=>{
    //fetchSSEData
    var ev = new EventSource(`/live/${company}`);
    ev.addEventListener('getstock',function(result){

      //Parse SSE data
      let stock = JSON.parse(result.data)
      console.log(stock);


      let value = stock.val
      let date_time = stock.date_time
      addData(chart,date_time,value)

      counter += 1
      if(counter>limit)
        removeData(chart)
    })
    console.log(chart);
  })

}

function draw_chart(labels,data,callback){
  var ctx = document.getElementById('chart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Price',
            data: data,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: false
                }
            }]
        }
    }
  });

  // Access chart from here
  callback(myChart)
}

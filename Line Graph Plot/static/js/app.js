
getdata();

var data, globaldata;
var date = [], year = [], month = [], day = [], hour = [], minute = [], weekday = [], actual = [], change = []
var e = 10;
var s = 0;

function getdata() {

  var url = `/data`;

  d3.json(url).then(function(xx) {

    data = xx.slice(0, 10);
    globaldata = xx;

    data.forEach(zz => {

      actual.push(zz['actual'])
      change.push(zz['change'])
    });
    
    // globaldata = xx;

    // console.log(actual)
    draw()
  })
}

var ydata, date, hour;
function newdata() {
  var ydata;
  e++;

  ydata = globaldata[e]['actual']
  date = globaldata[e]['date']
  hour = globaldata[e]['hour']

  return [ydata, date, hour];
}

// Plotly.plot('plot', [{ 
//   y: [(getdata)],
//   type: 'line',
//   line: {
//     color: "blue"
//   }
// }]); 

function draw() {

  var trace1 = {
    type: "line",
    // mode: "lines",
    y: actual,
    line: {
      color: "blue"
    }
  };

  var datap = [trace1];

  var layout = {
    title: `EUR-USD Forex`,
    yaxis: {
      autorange: true,
      type: "linear",
      title: `EURO to USD Rate`,
      rotation: 90,
    },
    xaxis: {
      title: `Hour: <b>${newdata()[2]}</b>, Day: ${newdata()[1]}`,
    }
  };

  Plotly.newPlot("plot", datap, layout, {responsive: true});
  interval();
}


var x = 0

function interval() {
setInterval(() => {

  Plotly.extendTraces('plot', {
    y: [[newdata()[0]]]}, [0]);
  
    x++;
    console.log(newdata()[1])

    if (x > 20) {
      Plotly.relayout('plot', {
        xaxis: {
          range: [x - 20, x],
          title: `Hour: <b>${newdata()[2]}</b>, Day: ${newdata()[1]}`,
        }
        // yaxis2: {
        //   title: 'yaxis2 title',
        //   titlefont: {color: '#ff7f0e'},
        //   tickfont: {color: '#ff7f0e'},
        //   anchor: 'free',
        //   overlaying: 'y',
        //   side: 'left',
        //   position: 0.15
        // }
      })
    }
  
}, 500);
}
/*/
var s = 0
var e = 10

var data;

function getdata() {

  var url = `/data`;

  d3.json(url).then(function(xx) {
    
    globaldata = xx;
    slicer()
  })
};

var date = [], year = [], month = [], day = [], hour = [], minute = [], weekday = [], actual = [], change = []
var b = 0

// function iterate() {
//   e += 1

//   if (e > 60) {
//     s = (e - 60)
//   }

// }

function slicer() {
  // date = [], year = [], month = [], day = [], hour = [], minute = [], weekday = [], actual = [], change = []

  data = globaldata.slice(s, e)

  catagorize()
};

var a1 = 0;

function catagorize() {

  console.log(data)

    data.forEach(zz => {
      date.push(zz['date'])
      hour.push(zz['hour'])
      minute.push(zz['minute'])
      actual.push(zz['actual'])
      change.push(zz['change'])
      
    });

    date_unq = [...new Set(date)]
    console.log(date_unq)
    if (date_unq > 1) {
      date_unq = `${date_unq[0]} - ${date_unq[1]}`
    }
  
  draw();
}

/*/

getdata();

var data, globaldata;
var date = [], year = [], month = [], day = [], hour = [], minute = [], weekday = [], actual = [], change = []
var e = 10;
var s = 0;
var range = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

function getdata() {

  var url = `/data`;

  d3.json(url).then(function(xx) {

    data = xx.slice(0, 10);
    globaldata = xx;

    data.forEach(zz => {

      actual.push(zz['actual'])
      change.push(zz['change'])
      if (zz['minute'] < 10) {
        minute.push(`:0${zz['minute']}`)
      }
      else {
        minute.push(`:${zz['minute']}`)
      }
      
    });
    
    // globaldata = xx;

    console.log(minute)
    draw()
  })
}

var ydata, date, hour, minutex;
function yact() {
  e += 1;

  ydata = globaldata[e]['actual']

  return ydata;
}

function newdata() {
  date = globaldata[e]['date']
  hour = globaldata[e]['hour']

  return [date, hour];
}


function mini() {
  e2 = e - 1

  if (e2 < 20) {
  if (globaldata[e]['minute'] < 10) {
    minute.push(`:0${globaldata[e]['minute']}`)
  }
  else {
    minute.push(`:${globaldata[e]['minute']}`)
  }
  }

  if (e2 >= 20) {
  if (globaldata[e2]['minute'] < 10) {
    minute.push(`:0${globaldata[e2]['minute']}`)
  }
  else {
    minute.push(`:${globaldata[e2]['minute']}`)
  }
  }

  minutex = minute

  if (e2 > 20) {
    minute.shift()
  }

  // console.log(minutex)
  return minutex;

}

function draw() {

  var trace1 = {
    type: "line",
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
      title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
      dtick: 1,
      ticktext: minute,
      tickvals: range
    }
  };

  Plotly.newPlot("plot", datap, layout, {responsive: true});
  interval();
}


var x = 9

function interval() {
setInterval(() => {

  Plotly.extendTraces('plot', {
    y: [[yact()]]}, [0]);
  
    x += 1;

    var rangex;
    range.push(x)

    rangex = range
    if (e > 20) {
      rangex.shift()
    }

    if (x < 20) {
      Plotly.relayout('plot', {
        xaxis: {
          dtick: 1,
          ticktext: mini(),
          tickvals: range
        }
      })
    }

    if (x > 20) {
      Plotly.relayout('plot', {
        xaxis: {
          range: [x - 20, x],
          title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
          dtick: 1,
          ticktext: mini(),
          tickvals: rangex
        }
      })
    }
  
}, 250);
}
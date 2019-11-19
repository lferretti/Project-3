
getdata();


var data, globaldata, reset;
var date = [], year = [], month = [], day = [], hour = [], minute = [], weekday = [], actual = [], poschange = [], negchange = []
// var gogo = false
var gogo = true
var max = 0

var e = Math.max(0, (max - 10));
xrange = 40
var s = 0;
var lineID = 'plot';
var barID = 'residual';

var range = Array(xrange).fill().map((x, z) => z);
var range2 = Array(xrange).fill().map((x, z) => z + .5);

var filterbtn = d3.select("#filter");
filterbtn.on("click", filterer)
var filtered, date_input, hour_input;
var hour_in, date_in;

// FILTER FUNTCIONS
// FILTER FUNTCIONS
// FILTER FUNTCIONS
// FILTER FUNTCIONS
// FILTER FUNTCIONS

function filterer() {

  clear();
  speedreset()
  spedometer();

  date_input = document.getElementById('date').value
  hour_input = document.getElementById('hour').value
  date_in = new Date(date_input);
  hour_in = Number(hour_input);

  // console.log(date_in, hour_in)

  filtered = globaldata.filter(x => new Date(x['date']) >= date_in)

  var date_chk = new Date(filtered[0]['date'])
  var hour_chk = filtered[0]['hour']

  if (String(date_chk) === String(date_in) && hour_chk != hour_in && hour_chk > hour_in) {
    d3.select('#hour').attr('value', hour)
    hour_in = hour_chk
  }
  else if (String(date_chk) > String(date_in)) {

  }
  // console.log(date_chk, date_in, hour_chk, hour_in)
  OntheHour();
}


function OntheHour() {

  function ClockStrikes(y) {
    return y['hour'] == hour_in;
  }

  var ind = filtered.findIndex(ClockStrikes)
  var new_data = filtered.slice(ind);


  globaldata = new_data;
  makedata();
}


function getdata() {

  var url = `/data`;

  d3.json(url).then(function(xx) {

    data = []
    // xx.slice(s, e)
    globaldata = xx;
    reset = xx;

  actual = [], minute = []
    
  makedata();

})
}

// Data Intitalizer
// Data Intitalizer
// Data Intitalizer
// Data Intitalizer
// Data Intitalizer
// Data Intitalizer

function makedata() {

  d3.select(`#${lineID}`).html('')
  d3.select(`#${barID}`).html('')

  pts = [], avg = [], y0 = [], y1 = [], x0 = [], x1 = [], color = []
  signif = false
  wait = 0
  actual = [], minute = [], poschange = [], negchange = [], shapes = []
  max = 0
  e = Math.max(0, (max - 10));
  s = 0

    data.forEach(zz => {

      actual.push(zz['actual'])
      var change = zz['change']

      if (change < 0) {
        negchange = change 
        poschange = 0
      }
      else {
        poschange = change
        negchange = 0
      }

    });

    clock()
}

function clock() {
  clockdata = globaldata.slice(s, xrange)

   clockdata.forEach(zz => {

      if (zz['minute'] < 10) {
        minute.push(`:0${zz['minute']}`)
      }
      else {
        minute.push(`:${zz['minute']}`)
      }
      
    });

    // console.log(minute)
    drawline()
}

// Data Call Iterators
// Data Call Iterators
// Data Call Iterators
// Data Call Iterators
// Data Call Iterators
// Data Call Iterators

var ydata, yneg, ypos, date, hour, minutex, runitback;
var shapeact = [], shapechange = [];
runitback = false

function yact() {

  e += 1;
  s += 1;

  ydata = globaldata[e]['actual']

  return ydata;
}

function ychange() {

  var delta = globaldata[e]['change']
  shapechange.push(globaldata[e]['change'])

  if (shapechange.length > 30) {
    shapechange.shift()
  }
  
  if (delta < 0) {
    yneg = delta
    ypos = ''
  }
  else {
    ypos = delta
    yneg = ''
  }


  return [ypos, yneg];
}

function newdata() {
  date = globaldata[e]['date']
  hour = globaldata[e]['hour']

  return [date, hour];
}

var e2 = xrange

function mini() {

  try {
    e2= e2 + 1
    minim = globaldata[e2]['minute'] 
  }
  catch {
    console.log('Reset')
    clear()
    speedreset()
    globaldata = reset
    makedata()
  }

  if (minim < 10) {
    minute.push(`:0${minim}`)
  }
  else {
    minute.push(`:${minim}`)
  }

  minute.shift()
  // console.log(minute)
  return minute;

}

// GRAPHS
// GRAPHS
// GRAPHS
// GRAPHS
// GRAPHS
// GRAPHS


var linedata; 
function drawline() {

  var linetrace1 = {
    type: "scatter",
    mode: 'lines',
    y: actual,
    line: {
      color: "blue"
    }
  };

  linedata = [linetrace1];

  var linelay = {
    title: `EUR-USD Forex <br>`,
    yaxis: {
      title: `EURO to USD Rate`,
      orientation: 'h',
      tickfont: {
        size: 'auto',
      },
      range: [0, 0],
      autorange: true,
      // type: "linear",
      dtick: .0001,
      showticklabels: false,
    },
    xaxis: {
      range: [0, xrange],
      title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
      tick0: 0,
      dtick: 1,
      ticktext: minute,
      tickvals: range,
    }
  };

  Plotly.newPlot(lineID, linedata, linelay, {responsive: true});

  drawbar();
}

// BAR
// BAR
// BAR
// BAR
// BAR


var bardata; 
function drawbar() {

  var bartrace1 = {
    name: 'increase',
    type: "bar",
    y: poschange,
    marker: {
      color: "green"
    }
  };

  var bartrace2 = {
    name: 'decrease',
    type: "bar",
    y: negchange,
    marker: {
      color: "red"
    }
  };

  bardata = [bartrace1, bartrace2];

  var barlay = {
    barmode: 'stack',
    showlegend: false,
    yaxis: {
      showgrid: true,
      showticklabels: false,
      title: `Change`,
      orientation: 'h',
      tickfont: {
        size: 'auto',
      },
      range: [0, 0],
      autorange: true,
      type: "linear",
      dtick: .0001,
    },
    xaxis: {
      showgrid: true,
      showticklabels: false,
      range: [.5, xrange],
      dtick: 1,
      tickvals: range2,
    }
  };

  Plotly.newPlot(barID, bardata, barlay, {responsive: true});

  if (gogo == true) {
    setTimeout(interval(), 3000);
  }
}


// INTERVAL
// INTERVAL
// INTERVAL
// INTERVAL
// INTERVAL
// INTERVAL


// var x = 0
var go;
// var speed = 60000;
var speed = 1000;
var once = 0
var shapes = []

function interval() {
if (once == 0) {
  go = setInterval(() => {

    once = 1;

    Plotly.extendTraces(lineID, {
      y: [[yact()]]}, [0]);

    var changling = ychange()
    // console.log(changling[0], changling[1])
    
    Plotly.extendTraces(barID, {
      y: [[changling[0]]]}, [0]);
    
    Plotly.extendTraces(barID, {
      y: [[changling[1]]]}, [1]);

      xrng_adj = xrange-9

      if (e > xrng_adj) {
        linedata[0].y.shift();
        bardata[0].y.shift();
        bardata[1].y.shift();
      }

      // x += 1;

      // if (e < max) {
      //   range.push(x)
      // }

      Plotly.relayout(lineID, {
        yaxis: {
          showticklabels: true,
        }
      })
      Plotly.relayout(barID, {
        yaxis: {
          showticklabels: true,
        },
      })

    workshop()

    xrng_adj
      if (e > xrng_adj) {
      labels = mini()
      
        Plotly.relayout(lineID, {
          xaxis: {
            range: [0, xrange+1],
            title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
            ticktext: labels,
            tickvals: range,
            tick0: 0,
            dtick: 1,
          },
          shapes: shapes,
        })

        Plotly.relayout(barID, {
          xaxis: {
            showticklabels: false,
            showgrid: true,
            range: [.5, xrange],
            tickvals: range2,
          },
        })
      }
    }, speed);
  }
}


//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS
//  BUTTONS



var speedset = d3.select("#speed")

function spedometer() {
  speedout = document.getElementById('speed');
  speedout.value = speed/1000;
}

speedset.on("change", function() {
  clear(); 
  speed = speedset.property("value")*1000;
  if (speed == 0) {
    clear()
    speed = 0
    spedometer()
  }
  else {
    interval()
  }
})


function clear() {
  once = 0;
  clearInterval(go)
}

function speedreset() {
  speed = 1000;
}

var pausebtn = d3.select("#pause");
pausebtn.on("click", function() {
  console.log('Pause')
  clear()
  speed = 0
  spedometer() 
})

var speedout = d3.select("#speed")

var playbtn = d3.select("#play");
playbtn.on("click", function() {
  clear()
  speedreset()
  spedometer()
  interval()
})

var fwdbtn = d3.select("#fwd");
fwdbtn.on("click", function() {
  clear(); 
  speed = (speed * .5);
  
  if (speed == 0) {
    clear()
    speed = 0
  }

  else {
    var cap= Math.max(500, speed)
    speed = cap
    interval()
  }
  spedometer() 
}
)

var slowbtn = d3.select("#slow");
slowbtn.on("click", function() {
  clear(); 
  speed = (speed * 2);
 
  if (speed == 0) {
    clear()
    speed = 0
  }
  else {
    var cap= Math.min(60000, speed)
    speed = cap
    interval()
  }
  spedometer() 
})


// SVG Trace ###
// SVG Trace ###
// SVG Trace ###
// SVG Trace ###
// SVG Trace ###
// SVG Trace ###


var pts = [], avg = [], y0 = [], y1 = [], x0 = [], x1 = [], color = [], profit, signif, trend, len, wait
signif = false
wait = 0

function workshop() {
  if (wait == 0 && e >= 15) {
    sum()
  }
  else if (wait > 0) {
    wait = Math.max(0, wait - 1)
  }
  craft()
}

function sum() {
  end = shapechange.length
  start = end - 15
  pts = shapechange.slice(start, end)
  actpts = linedata[0].y.slice(start, end)

  // console.log('pts', pts)
  len = pts.length - 1

  avg.push(pts.reduce((first, second) => first + second) / pts.length)
  // console.log("AVG", avg)

  if (avg.length > 15) {
    avg.shift()
    avgcalc()
    // console.log("AVG", avg)
  }

}

function avgcalc() {

  var endval, startval;
  endval = actpts[len]
  startval = actpts[0]
  
  trend = avg.reduce((first, second) => first + second) / avg.length

  var lim = .000005
  if (trend > lim || trend < (lim*-1)) {
    signif = true

    if (endval > startval) {
      color.push('green')
    }
    else {
      color.push('red')
      // console.log(endval, startval, actpts)
    }

  }
  else {
    signif = false
  }

  if (signif == true) {
    x0.push(start)
    y0.push(startval)
    x1.push(end)
    y1.push(endval)
    wait = 25
    console.log("Trend", trend, signif)
  }
  craft()

}

function craft() {
  var adjx0 = [], adjx1 = [], adjy0 = [], adjy1 = []
  shapes = []
  // console.log(x1[0])
  if (x1[0] < 0) {
    x0.shift()
    y0.shift()
    x1.shift()
    y1.shift()
    color.shift()
  }

  for(i = 0; i < x1.length; i++) {

  shapes.push({
    type: 'rect',
    xref: 'x',
    yref: 'paper',
    x0: x0[i],
    y0: 0,
    x1: x1[i],
    y1: 1,
    fillcolor: color[i],
    opacity: 0.2,
    line: {
        width: 0
    }
    })
    shapes.push({
      type: 'line',
      x0: x0[i],
      y0: y0[i],
      x1: x1[i] + 10,
      y1: y1[i],
      line: {
        color: 'black',
        width: 2,
        dash: 'dashdot'
      }
    })

    adjx0.push(x0[i] - 1)
    adjy0.push(y0[i] - 1)
    adjx1.push(x1[i] - 1)
    adjy1.push(y1[i] - 1)
  }

  x0 = adjx0
  // y0 = adjy0
  x1 = adjx1

}

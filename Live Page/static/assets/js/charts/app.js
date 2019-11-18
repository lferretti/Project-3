
getdata();


var data, globaldata;
var date = [], year = [], month = [], day = [], hour = [], minute = [], weekday = [], actual = [], poschange = [], negchange = []
// var gogo = false
var gogo = true
var max = 0

var e = Math.max(0, (max - 10));
xrange = 40
var s = 0;
var lineID = 'plot';
var barID = 'residual';

var range = Array(xrange).fill().map((x, i) => i);

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

  console.log(hour_in, date_in)

  clearInterval(go)
  speed = 1000

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

  actual = [], minute = [], poschange = [], negchange = []
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

var ydata, yneg, ypos, date, hour, minutex;
function yact() {
  e += 1;
  s += 1;

  ydata = globaldata[e]['actual']

  return ydata;
}

function ychange() {

  var delta = globaldata[e]['change']
  
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
  e2 = e2 + 1
  
  minim = globaldata[e2]['minute'] 

  if (minim < 10) {
    minute.push(`:0${minim}`)
  }
  else {
    minute.push(`:${minim}`)
  }

  // if (minute.length > max) {
  minute.shift()
  // }
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

  d3.select(`#${lineID}`).html('')

  var trace1L = {
    type: "scatter",
    mode: 'lines',
    y: actual,
    line: {
      color: "blue"
    }
  };

  linedata = [trace1L];

  var layoutL = {
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
    },
    xaxis: {
      range: [0, xrange],
      title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
      tick0: 1,
      ticktext: minute,
      tickvals: range,
    }
  };

  Plotly.newPlot(lineID, linedata, layoutL, {responsive: true});

  drawbar();
}

//
//
//

var bardata; 
function drawbar() {

  d3.select(`#${barID}`).html('')

  var trace1b = {
    name: 'increase',
    type: "bar",
    y: poschange,
    marker: {
      color: "green"
    }
  };

  var trace2b = {
    name: 'decrease',
    type: "bar",
    y: negchange,
    marker: {
      color: "red"
    }
  };

  bardata = [trace1b, trace2b];

  var layoutb = {
    barmode: 'stack',
    showlegend: false,
    yaxis: {
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
      range: [0, xrange],
      dtick: 1,

    }
  };

  Plotly.newPlot(barID, bardata, layoutb, {responsive: true});

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


var x = 0
var go;
// var speed = 60000;
var speed = 1000;

function interval() {
go = setInterval(() => {

  Plotly.extendTraces(lineID, {
    y: [[yact()]]}, [0]);

  var changling = ychange()
  // console.log(changling[0], changling[1])
  
  Plotly.extendTraces(barID, {
    y: [[changling[0]]]}, [0]);
  
  Plotly.extendTraces(barID, {
    y: [[changling[1]]]}, [1]);

    xrng_adj = xrange-10

    if (e > xrng_adj) {
      linedata[0].y.shift();
      bardata[0].y.shift();
      bardata[1].y.shift();
    }

    x += 1;

    if (e < max) {
      range.push(x)
    }


    if (e > xrng_adj) {
    labels = mini()
    
      Plotly.relayout(lineID, {
        xaxis: {
          range: [0, xrange],
          title: `Hour: <b>${newdata()[1]}</b>, Day: ${newdata()[0]}`,
          ticktext: labels,
          tickvals: range,
        },
      })

      Plotly.relayout(barID, {
        xaxis: {
          range: [0, xrange],
        },
      })
    }
  
}, speed);
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
  clearInterval(go); 
  speed = speedset.property("value")*1000;
  if (speed == 0) {
    clearInterval(go)
    speed = 0
    spedometer()
  }
  else {
    interval()
  }
})

var pausebtn = d3.select("#pause");
pausebtn.on("click", function() {
  clearInterval(go)
  speed = 0
  spedometer() 
})

var speedout = d3.select("#speed")

var playbtn = d3.select("#play");
playbtn.on("click", function() {
  clearInterval(go)
  speed = 1000; 
  spedometer()
  interval()
})

var fwdbtn = d3.select("#fwd");
fwdbtn.on("click", function() {
  clearInterval(go); 
  speed = (speed * .5);
  if (speed == 0) {
    clearInterval(go)
    speed = 0
  }
  else {
    interval()
  }
  spedometer() 
}
)

var slowbtn = d3.select("#slow");
slowbtn.on("click", function() {
  clearInterval(go); 
  speed = (speed * 2);
  if (speed == 0) {
    clearInterval(go)
    speed = 0
  }
  else {
    interval()
  }
  spedometer() 
})



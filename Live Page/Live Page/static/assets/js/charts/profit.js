// Start second interval

interval2()

var pip = d3.select("#pip")
var moolah = d3.select("#money")
var buysell = d3.select("#action")
var date_html = d3.select("#day")
var time_html = d3.select("#time")

var all_dict = [];

var dinero = 10000

var input = output
var p = pipchange
var ract = reco

var checks = pipchange

//Update variables imported from app.py, if new trend was found and variable has been updated then add new data to reports
function interval2() {
setInterval(() => {
  input = output
  p = pipchange
  ract = reco

  if (checks != p) {
    newresult()
  }

}, 1000);
}

var format, rounded, dough, reco2, bucks, bos 

//Use imported data to make a quick text report show postive or negative movement
function newresult() {
  checks = p

  // console.log(p)

  //Calculate monetary value of pipchange
  dough = Math.round((dinero * p) * 100)/100
  rounded = (Math.round(p * 100000)/100000).toFixed(5)

  var up, down
  var sym, sym2;

  //Format the output accordingly. Make sure right symbols for buying and selling, (buy is postive correlation, sell is negative correlation)
  //e.g. if user sells and eur-usd rate goes down then user made money.
  up = "glyphicon glyphicon-triangle-top"
  down = "glyphicon glyphicon-triangle-bottom"

  
  if (ract == "Buy") {
    dinero = Math.round((dinero + dough) * 100)/100
    rolls = dough.toFixed(2)
      if (p >= 0) {
        format = [up, 'green']
        sym = '+'
        sym2 = '+'
      }
      else if (p < 0) {
        format = [down, 'red']
        sym = '-'
        sym2 = '-'
      }
    }
  else {
    dinero = Math.round((dinero - dough) * 100)/100
    rolls = (dough*-1).toFixed(2)
      if (p <= 0) {
        format = [up, 'green']
        sym = '+'
        sym2 = '-'
      }
      else if (p > 0) {
        format = [down, 'red']
        sym = '-'
        sym2 = '+'
      }
  }


  //Format time outputs
  var bigben;
  if (input[2] < 10) {
    bigben = `${input[1]}:0${input[2]}`
  }
  else {
    bigben = `${input[1]}:${input[2]}`
  }

  //Use of tofixed(x) makes sure the right number of decimals are shown
  coins = dinero.toFixed(2)
  
  // output variables to html text
  date_html.text(`Date: ${input[0]}`)
  time_html.text(`Time: ${bigben}`)
  buysell.style('font-weight', 'bold').text(`${ract}`)
  pip.style('color', format[1]).text(`${sym2} ${Math.abs(rounded)}  `).append('i').style('color', format[1]).attr('class',format[0])
  moolah.style('color', format[1]).text(`${sym}$ ${Math.abs(dough).toFixed(2)}  `).append('i').style('color', format[1]).attr('class',format[0])

  //create array for table
  all_dict = input.concat([ract, rounded, rolls, coins])
  
  tabelizer()
}

var history
var tbody = d3.select("#outbody");

//enter all new entries into table for historical data
function tabelizer() {

  var row = tbody.append("tr");
  all_dict.forEach((entry) => { 
  var cell = row.append("td");
    cell.text(entry);
    });

  all_dict = []
}


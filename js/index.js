const api = 'http://www.nbrb.by/API/';
let selectCurrency;

$('#code').change(() => selectCurrency = +$('#code').val());
$('#code').change(() =>
  $.getJSON(api + 'ExRates/Rates/' + selectCurrency).done((data) =>
  $('#today').text(`${data.Cur_Scale} ${data.Cur_Abbreviation} costs ${data.Cur_OfficialRate} BN`))
);

                                      //schedule
const calendarTo = $('#to'), calendarFrom = $('#from');
let date = new Date(), day = date.getDate(), month = date.getMonth()+1, year = date.getFullYear();
if(day < 10) {day = '0' + day}
if(month < 10) {month = '0' + month}
date = year + '-' + month + '-' + day;
calendarTo.attr('value', date);
calendarFrom.attr('max', date);

const canvas = document.getElementById('canvas');
let w = canvas.width, h = canvas.height, schedule = canvas.getContext('2d'),
days = 0, minRate = 0, maxRate = 1, count = 0;
color = ['blue', 'red', 'green', 'orange', 'yellow', 'gray','aquamarine', 'darkviolet', 'palegreen', 'sienna'];

$(document).ready(() => selectCurrency = +$('#code').val(), toDate = $('#to').val());
$('#from').change(() =>	fromDate = $('#from').val());
$( '#to' ).change(() => toDate = $('#to').val());
$('#push').click(() => count = Math.floor(Math.random() * 10));
$('#push').click(() =>
	$.getJSON(api + 'ExRates/Rates/Dynamics/' + selectCurrency, { 'startDate': fromDate, 'endDate': toDate }).done(function (data) {
		$.each(data, (key, item) => {
		  let full = item.Cur_OfficialRate * 10000 + '',
      newC = full.split('.')[0];
		  if (minRate === 0 ) minRate = +newC.slice(0, 2);
		  if (+newC.slice(0, 2) < minRate) minRate = +newC.slice(0, 2);
	  })
    $.each(data, (key, item) => {
    	days = data.length;
    	if (getPropCurrency(item.Cur_OfficialRate) > maxRate) maxRate = getPropCurrency(item.Cur_OfficialRate);
    })
    $.each(data, (key, item) => drawSchedule(key, item))
  })
)

function coordinateGrid() {
  schedule.strokeStyle = 'black';
  schedule.lineWidth = 4;
	line(10, h - 8, 10, 0);
	line(10, 0, 5, 20);
	line(10, 0, 15, 20);
	line(10, h - 10, w, h -10);
	line(w, h - 10, w - 20, h - 15);
	line(w, h - 10, w - 20, h - 5);
}

coordinateGrid()

function line (x0, y0, x1, y1) {
	schedule.beginPath();
	schedule.moveTo(x0, y0);
	schedule.lineTo(x1, y1);
	schedule.stroke();
}

function drawSchedule(key, item) {
	let sum, step = (h - 54) / maxRate,	curr = getPropCurrency(item.Cur_OfficialRate);
	key === 0	?	(sum = 1,	prev = curr) : sum = key;
  scheduleLine((w - 24) / days * sum, prev * step, (w - 24) / days * (key + 1), curr * step, color[count]);
  prev =  curr;
}

function getPropCurrency(currency) {
	let full = currency * 10000 + '';
	newCurrency = full.split('.')[0];
	return newCurrency.slice(0, 2) > minRate ? +newCurrency.slice(-3) + (newCurrency.slice(0, 2) - minRate)*1000 : +newCurrency.slice(-3);
}

function scheduleLine (x0, y0, x1, y1, color) {
	schedule.strokeStyle = color;
	schedule.beginPath();
	schedule.moveTo(10 + x0, h - 10 - y0);
	schedule.lineTo(10 + x1, h - 10 - y1);
	schedule.stroke();
}

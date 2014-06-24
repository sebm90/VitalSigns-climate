var series = [];
var sensors = {};
var datesIncluded = {};
var averageTemps = {};

var options = {
	title: {
        text: 'Mean Temperature August 2010'
    },
    chart: {
        renderTo: 'container',
        defaultSeriesType: 'line',
    },
    xAxis: {
        categories: []
    },
    yAxis: {
        title: {
            text: 'Mean Temperature (C)'
        }
    },
    tooltip: {
    	categorySuffix: 'th day',
        valueSuffix: '°C',
    },
    series: []
};

$.get('data/climate data/CLM-Data_Entry-v3/Data-Table-all-sensors.csv', function(data) {

    var lines = data.split('\n');

    var sensorIndex = 0;

    $.each(lines, function(lineNo, line) {
        var items = line.split(',');

        if (lineNo > 0) {

            if(!sensors[items[0]]) {
                datesIncluded[items[0]] = [];
                var thisSensorObject = {};
                thisSensorObject.name = items[0];
                thisSensorObject.data = [];
                thisSensorObject.readings = {};
                series.push(thisSensorObject);
                sensors[items[0]] = items[0];
                sensorIndex++;
                console.log(sensorIndex);
 			}

           var found = $.inArray(items[1], datesIncluded[items[0]]);



var currentSensor = parseFloat(sensorIndex - 1);

//console.log(datesIncluded[items[0]]);

           if(found == -1) {
           	if(items[2] == 8) { //August
				datesIncluded[items[0]].push(items[1]);
               series[currentSensor].data.push(parseFloat(items[6]));
               series[currentSensor].readings[items[1]] = [];
               series[currentSensor].readings[items[1]].push(items[4]);
           	}
           } else {
           	if(items[2] == 8) { //August
           	var currentDate = series[currentSensor].data.length - 1;
               series[currentSensor].data[currentDate] += parseFloat(items[6]);
               series[currentSensor].readings[items[1]].push(items[4]);
               }
           }

        }
    });

$.each(series, function(index, value) {
	$.each(series[index].data, function(i, v) {
		var numberOfReadings = series[index].readings[i+1].length;
		//console.log(numberOfReadings);
		series[index].data[i] = v/numberOfReadings;
	});
});

console.log(datesIncluded);

	options.xAxis.categories = datesIncluded;
	options.series = series;

    var chart = new Highcharts.Chart(options);
});
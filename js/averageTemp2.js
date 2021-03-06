var series = [];
var sensors = {};
var datesIncluded = {};
var averageTemps = {};

function range1(i){return i?range1(i-1).concat(i):[]} //create an array of integers

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
 			}

			var currentSensor = parseFloat(sensorIndex - 1);
			var found = $.inArray(items[1], datesIncluded[items[0]]);

			if(items[2] == 8) {
				if(found == -1) {
					datesIncluded[items[0]].push(items[1]);
					series[currentSensor].data.push(parseFloat(items[6]));
					series[currentSensor].readings[items[1]] = [];
					series[currentSensor].readings[items[1]].push(items[4]);
				} else {
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
			series[index].data[i] = v/numberOfReadings;
			series[index].data[i] = parseFloat(series[index].data[i].toFixed(2));
		});
	});

	console.log(series);

	options.xAxis.categories = range1(31);
	options.series = series;

    var chart = new Highcharts.Chart(options);
});
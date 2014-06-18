var series = [];
var sensors = [];
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
    $.each(lines, function(lineNo, line) {
        var items = line.split(',');

        if (lineNo > 0) {

            if(!sensors[items[0]]) {
                datesIncluded[items[0]] = [];
                sensors[items[0]] = [];
 }

console.log(sensors);

            var found = $.inArray(items[1], datesIncluded[items[0]]);
                if(found == -1) {
                    datesIncluded[items[0]].push(items[1]);
                    sensors[items[0]].push(parseFloat(items[6]));
                } else {
                    sensors[items[0]] += parseFloat(items[6]);
                }


        }
    });

    console.log(sensors);

	$.each(averageTemps, function(dayNo, value) {
		averageTemps[dayNo] = value/12;
		averageTemps[dayNo] = parseFloat(averageTemps[dayNo].toFixed(2));
	});

	var averageTempsArray = $.map(averageTemps, function(value, index) {
    	return [value];
	});

	options.xAxis.categories = datesIncluded;
	options.series = [{ data: averageTempsArray,
						name: 'Serial # 5500000016036E41'
					}];

    var chart = new Highcharts.Chart(options);
});
var url = "/data/sunburst";
var sunburst_slide_input = document.querySelector('#range');

d3.json(url).then(function(data){

    // Splice in transparent for the center circle
    Highcharts.getOptions().colors.splice(0, 0, 'transparent');

    var chart = Highcharts.chart('sun-burst', {

    chart: {
        height: '100%'
    },

    title: {
        text: 'Malaria Death 2017'
    },
    
    series: [{
        type: "sunburst",
        data: data["2017"],
        allowDrillToNode: true,
        cursor: 'pointer',
        dataLabels: {
        format: '{point.name}',
        colors: ['#2f7ed8', '#0d233a', '#8bbc21'],
        filter: {
            property: 'innerArcLength',
            operator: '>',
            value: 100
        }
        },
        levels: [{
        level: 1,
        levelIsConstant: false,
        dataLabels: {
            filter: {
            property: 'outerArcLength',
            operator: '>',
            value: 500
            }
        }
        }, {
        level: 2,
        colorByPoint: true
        },
        {
        level: 3,
        colorVariation: {
            key: 'brightness',
            to: 0.5
        }
        }]

    }],
    tooltip: {
        headerFormat: "",
        pointFormat: 'The Malaria Death Cases of <b>{point.name}</b> is <b>{point.value}</b>'
    }

    });

    sunburst_slide_input.addEventListener('input', function(event) {

        var year = sunburst_slide_input.value;

        chart.series[0].setData(data[year]);
        chart.setTitle({text: `Malaria Death ${year}`});

    }, false);

})
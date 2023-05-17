const ctx_temp = document.getElementById('chartTemperature');
const ctx_humid = document.getElementById('chartHumidity');
const ctx_light = document.getElementById('chartLight');
const ctx_wind = document.getElementById('chartWind');

const color_temp = '#ef233c'
const color_humid = '#8ecae6'
const color_light = '#fdd85d'
const color_wind = '#4f6d7a'

const default_data = []

const chart_temp = create_chart(ctx_temp, color_temp, default_data, -10, 30);
const chart_humid = create_chart(ctx_humid, color_humid, default_data, 0, 100);
const chart_light = create_chart(ctx_light, color_light, default_data, 0, 100);
const chart_wind = create_chart(ctx_wind, color_wind, default_data, 0, 30);

function create_chart(canva, color, data, mini, maxi) {
    return new Chart(canva, {
        type: "line",
        data: {
            datasets: [{
                borderColor: color,
                data: data,
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            radius: 0,
            borderWidth: 1,
            responsive: true,
            maimaintainAspectRatio: false,
            parsing: !1,
            normalized: !0,
            animation: !1,
            interaction: {
                mode: "nearest",
                axis: "x",
                intersect: !1
            },
            plugins: {
                tooltip: {
                    enabled: false 
                },
                legend: !1,
                decimation: {
                    enabled: !0
                }
            },
            scales: {
                x: {
                    type: "linear",
                    display: !1,
                    bounds: "data"
                },
                y: {
                    type: "linear",
                    display: !1,
                    suggestedMin: mini,
                    suggestedMax: maxi
                }
            }
        }
    });
}

//const test = {'temperature':[16, 15, 16, 14, 15, 13, 14, 14, 12, 12, 13, 14, 13, 14, 15, 14, 14, 15, 13, 12, 10, 10, 11, 12, 11, 13, 12, 11, 10, 10, 11, 13, 15, 14, 13, 11, 13, 13, 13, 14, 12, 14, 13, 13, 15, 16, 14, 12, 12, 10], 'humidity': [70, 68, 63, 60, 62, 66, 68, 70, 71, 67, 68, 68, 69, 65, 65, 62, 67, 64, 60, 59, 55, 54, 55, 56, 55, 54, 53, 54, 59, 64, 69, 66, 69, 65, 68, 64, 62, 61, 60, 63, 62, 58, 55, 57, 62, 64, 64, 64, 65, 62], 'light':[28, 32, 30, 33, 34, 35, 38, 42, 45, 46, 46, 49, 52, 52, 48, 53, 53, 58, 53, 52, 56, 57, 52, 55, 58, 53, 57, 58, 63, 62, 58, 57, 52, 57, 57, 55, 56, 54, 57, 54, 52, 47, 43, 40, 44, 41, 45, 50, 48, 49], 'wind':[17, 19, 18, 20, 19, 21, 21, 20, 19, 18, 19, 20, 20, 21, 23, 23, 24, 23, 21, 23, 23, 21, 21, 23, 24, 22, 23, 21, 22, 22, 23, 24, 23, 22, 20, 18, 18, 16, 18, 19, 19, 21, 19, 19, 21, 23, 22, 21, 22, 23]};
//const test1 = {'temperature':[0, 0, 0, 0, 2, 1, 0, -2, -3, -2, -3, -1, 1, 3, 4, 6, 4, 2, 4, 3, 3, 4, 6, 6, 6, 8, 8, 6, 5, 4, 6, 6, 4, 5, 3, 5, 4, 3, 2, 1, 1, 1, 2, 0, 2, 1, -1, -1, -2, -1], 'humidity': [49, 45, 44, 42, 44, 40, 44, 43, 48, 52, 54, 56, 59, 61, 65, 64, 65, 70, 67, 63, 68, 63, 60, 56, 56, 55, 58, 58, 62, 61, 58, 54, 49, 49, 48, 49, 47, 44, 44, 42, 37, 41, 40, 38, 43, 38, 37, 41, 38, 39], 'light':[32, 30, 33, 34, 35, 38, 42, 45, 46, 46, 49, 52, 52, 48, 53, 53, 58, 53, 52, 56, 57, 52, 55, 58, 53, 57, 58, 63, 62, 58, 57, 52, 57, 57, 55, 56, 54, 57, 54, 52, 47, 43, 40, 44, 41, 45, 50, 48, 49, 51], 'wind':[75, 72, 70, 72, 76, 74, 73, 70, 72, 67, 67, 65, 62, 62, 62, 66, 69, 68, 65, 60, 62, 61, 66, 65, 68, 68, 71, 67, 66, 62, 63, 66, 61, 63, 61, 60, 62, 61, 62, 64, 67, 71, 69, 71, 69, 66, 65, 66, 63, 62]};


function update_charts(db) {

    var temp = [];
    var humid = [];
    var light = [];
    var wind = [];

    for (let i = 0; i < 50; i++) {
        temp.push({'x':i, 'y':db['temperature'][i]})
        humid.push({'x':i, 'y':db['humidity'][i]})
        light.push({'x':i, 'y':db['light'][i]})
        wind.push({'x':i, 'y':db['wind'][i]})
    }

    chart_temp.data.datasets[0].data = temp;
    chart_humid.data.datasets[0].data = humid;
    chart_light.data.datasets[0].data = light;
    chart_wind.data.datasets[0].data = wind;
    chart_temp.update();
    chart_humid.update();
    chart_light.update();
    chart_wind.update();
}
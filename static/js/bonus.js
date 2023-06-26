d3.json(dataUrl).then(function(data) {
    console.log(data);
  });
  
  function init() {
    let dropMenu = d3.select("#selDataset");
  
    d3.json(dataUrl).then((data) => {
      let names = data.names;
      names.forEach((id) => {
        dropMenu.append("option")
          .text(id)
          .property("value", id);
      });
  
      let sample_one = names[0];

      console.log(sample_one);
  
      buildGaugeChart(sample_one);
      getData(sample_one);
    });
  };
  
  function buildGaugeChart(sample) {
    d3.json(dataUrl).then((data) => {
      let metadata = data.metadata;
      let value = metadata.filter(result => result.id == sample);

      console.log(value)
  
      let valueData = value[0];
      let washFrequency = Object.values(valueData)[6];
  
      let trace2 = {
        type: 'pie',
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        value: washFrequency,
        text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
        title: {
          text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
          font: { color: "black", size: 16 }
        },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 10], tickmode: "linear", tick0: 1, dtick: 1 },
          bar: { color: "black" },
          steps: [
            { range: [0, 1], color: "rgb(227,242,253)" },
            { range: [1, 2], color: "rgb(197,226,255)" },
            { range: [2, 3], color: "rgb(158,204,255)" },
            { range: [3, 4], color: "rgb(119,181,254)" },
            { range: [4, 5], color: "rgb(81,159,254)" },
            { range: [5, 6], color: "rgb(42,136,255)" },
            { range: [6, 7], color: "rgb(4,114,255)" },
            { range: [7, 8], color: "rgb(3,96,199)" },
            { range: [8, 9], color: "rgb(3,79,162)" },
            { range: [9, 10], color: "rgb(2,61,125)" },
          ]
        }
      };
  
      let layout = {
        width: 400,
        height: 400,
        margin: { t: 0, b: 0 }
      };
  
      Plotly.newPlot("gauge", [trace2], layout);
    });
  };
  
  function getData(sample) {
    d3.select("#sample-metadata").html("");
  
    d3.json(dataUrl).then((data) => {
      let metadata = data.metadata;
      let filteredData = metadata.filter(result => result.id == sample);
      let result = filteredData[0];
      Object.entries(result).forEach(([key, value]) => {
        d3.select("#sample-metadata")
          .append("p")
          .text(`${key}: ${value}`);
      });
    });
  };
  
  function optionChanged(sample) {
    buildGaugeChart(sample);
    getData(sample);
  };
  
  init();
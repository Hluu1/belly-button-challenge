const dataUrl = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

d3.json(dataUrl).then(function(data) {
  const { names, samples, metadata } = data;
  const dropdown = d3.select("#selDataset");
  names.forEach(name => {
    dropdown.append("option")
      .attr("value", name)
      .text(name);
  });

  function updateDashboard(selectedSample) {
    const selectedData = samples.find(sample => sample.id === selectedSample);
    const top10SampleValues = selectedData.sample_values.slice(0, 10).reverse();
    const top10OtuIds = selectedData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const top10OtuLabels = selectedData.otu_labels.slice(0, 10).reverse();
    const barTrace = {
      x: top10SampleValues,
      y: top10OtuIds,
      text: top10OtuLabels,
      type: "bar",
      orientation: "h"
    };

    const barData = [barTrace];

    const barLayout = {
      title: `Top 10 OTUs for Sample ${selectedSample}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };

    Plotly.newPlot("bar", barData, barLayout);

    const selectedMetadata = metadata.find(meta => meta.id === parseInt(selectedSample));
    const metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("");
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });

    const bubbleTrace = {
      x: selectedData.otu_ids,
      y: selectedData.sample_values,
      text: selectedData.otu_labels,
      mode: "markers",
      marker: {
        size: selectedData.sample_values,
        color: selectedData.otu_ids,
        colorscale: "Earth"
      }
    };

    const bubbleData = [bubbleTrace];

    const bubbleLayout = {
      title: "OTU Bubble Chart",
      xaxis: { title: "OTU IDs" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  }

  function getData() {
    let dropdownMenu = d3.select("#selDataset");
    let selectedSample = dropdownMenu.property("value");
    updateDashboard(selectedSample);
  }

  d3.selectAll("#selDataset").on("change", getData);

  const initialSample = names[0];
  updateDashboard(initialSample);
});


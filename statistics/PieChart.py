from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.shapes import Drawing 
from reportlab.lib.colors import Color, HexColor

import json

class PieChart(Drawing):
    
    def __init__(self, data, labels):
        super(PieChart, self).__init__(400,200)

        colors = [  
            HexColor("#0000e5"),  
            HexColor("#ff0011"),
            HexColor("#800000"),
            HexColor("#e05897"),   
            HexColor("#a08ff7"),  
            HexColor("#8f8ff5"),  
            HexColor("#c7c7fa"),  
            HexColor("#800000"),  
            HexColor("#eb8585"),   
            HexColor("#d60a0a"),  
            HexColor("#ffff00"),
            HexColor("#1f1feb"),   
        ]  

        # Create pie chart 
        pieChart = Pie()
        pieChart.x = 40
        pieChart.y = 30
        pieChart.width = 120
        pieChart.height = 120
        pieChart.slices.strokeWidth=0.5
        data = json.loads(data)
        pieChart.data = data
        pieChart.labels = []
        labels = json.loads(labels.replace("'",'"'))
        for d in data:
            pieChart.labels.append(str(d))

        # Create legend
        legend = Legend()
        legend.x = 380
        legend.y = 60  
        legend.boxAnchor           = 'se'  
        legend.subCols[1].align    = 'right'
        legend.colorNamePairs = []

        len_data = len(data) 
        for i in range(0,len_data):
            pieChart.slices[i].fillColor = colors[i]
            legend.colorNamePairs.append((colors[i],labels[i]))

        self.add(pieChart, "pie chart")       
        self.add(legend, "legend")

from datetime import date

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus.tables import Table, TableStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.graphics.charts.piecharts import Pie
from reportlab.graphics.charts.legends import Legend
from reportlab.graphics.shapes import Drawing

from pulpo_forms.statistics.PieChart import PieChart


class StatisticsPdf():

    def __init__(self, buffer, pageSize, statistics):
        self.buffer = buffer
        self.statistics = statistics
        if pageSize == "A4":
            self.pageSize = A4
        else:
            self.pageSize = letter
        self.width, self.height = self.pageSize

    @staticmethod
    def _header_footer(canvas, doc):
        # Save the state of our canvas so we can draw on it
        canvas.saveState()
        styles = getSampleStyleSheet()

        # Header
        header = Paragraph(
            'Field statistics report: ' + str(date.today()), styles['Normal'])
        w, h = header.wrap(doc.width, doc.topMargin)
        header.drawOn(canvas, doc.leftMargin, doc.height + doc.topMargin - h)

        # Footer
        footer = Paragraph('Survey Report', styles['Normal'])
        w, h = footer.wrap(doc.width, doc.bottomMargin)
        footer.drawOn(canvas, doc.leftMargin, h)

        # Release the canvas
        canvas.restoreState()

    def print_statistics(self):
        buffer = self.buffer
        doc = SimpleDocTemplate(buffer,
                                rightMargin=inch / 4,
                                leftMargin=inch / 4,
                                topMargin=inch / 2,
                                bottomMargin=inch / 4,
                                pagesize=self.pageSize)

        # Our container for 'Flowable' objects
        elements = []

        # A large collection of style sheets pre-made for us
        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='centered', alignment=TA_CENTER))

        # Draw things on the PDF. Here's where the PDF generation happens.
        elements.append(Paragraph(
            self.statistics["field_text"], styles['Heading1']))

        if self.statistics["field_type"] == 'NumberField':
            pieChart = PieChart(
                self.statistics["quintilesY"], self.statistics["quintilesX"])
        else:
            pieChart = PieChart(
                self.statistics["total_per_option"],
                self.statistics["options"])

        elements.append(pieChart)

        # Draw table
        rows = [["Field type", self.statistics["field_type"]],
                ["Answered fields", self.statistics["total_filled"]],
                ["Empty fields", self.statistics["total_not_filled"]],
                ["Required", self.statistics["required"]]
                ]

        if self.statistics["field_type"] == 'NumberField':
            rows.append(
                ["Mean", self.statistics["mean"]])
            rows.append(
                ["Total Mean", self.statistics["total_mean"]])
            rows.append(
                ["Standard Deviation", self.statistics["standard_deviation"]])
            rows.append(
                ["Total Standard Deviation",
                    self.statistics["total_standard_deviation"]])

        table = Table(rows)
        table.setStyle(
            TableStyle([('GRID', (0, 0), (-1, -1), 0.25, colors.black)]))
        elements.append(table)

        doc.build(
            elements,
            onFirstPage=self._header_footer,
            onLaterPages=self._header_footer)

        # Get the value of the BytesIO buffer and write it to the response.
        pdf = buffer.getvalue()
        buffer.close()
        return pdf

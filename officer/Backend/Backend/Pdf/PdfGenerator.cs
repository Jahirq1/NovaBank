using PdfSharpCore.Drawing;
using PdfSharpCore.Pdf;
using Backend.Models;
using System;
using System.IO;

namespace Backend.Pdf
{
    public class PdfGenerator
    {
        public byte[] GenerateLoanPdf(Loans loan, User user)
        {
            using (var ms = new MemoryStream())
            {
                var document = new PdfDocument();
                var page = document.AddPage();
                var gfx = XGraphics.FromPdfPage(page);

                var titleFont = new XFont("Verdana", 18, XFontStyle.Bold);
                var headerFont = new XFont("Verdana", 14, XFontStyle.Bold);
                var textFont = new XFont("Verdana", 12);
                int y = 40;

                // Titulli dhe logoja e bankës
                gfx.DrawString("NOVABANK", titleFont, XBrushes.DarkBlue, new XPoint(40, y));
                y += 30;
                gfx.DrawString("Dokument i Aplikimit për Kredi", headerFont, XBrushes.Black, new XPoint(40, y));
                y += 30;

                // Seksioni: Të dhënat personale
                gfx.DrawString("Të dhënat e klientit:", headerFont, XBrushes.Black, new XPoint(40, y));
                y += 25;
                gfx.DrawString($"Personal ID: {user.PersonalID}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Adresa: {user.address ?? "N/A"}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Email: {user.email ?? "N/A"}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Nr. Telefoni: {user.phone ?? "N/A"}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 30;

                // Seksioni: Të dhënat e kredisë
                gfx.DrawString("Detajet e Kredisë:", headerFont, XBrushes.Black, new XPoint(40, y));
                y += 25;
                gfx.DrawString($"Kredi ID: {loan.LoanId}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Data e aplikimit: {loan.ApplicationDate.ToShortDateString()}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Statusi i punës: {loan.WorkingStatus}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Të ardhurat mujore: {loan.MonthlyIncome:C}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Shuma e kredisë: {loan.LoanAmount:C}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Arsyeja: {loan.Reason}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Kohëzgjatja (muaj): {loan.DurationMonths}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Kolateral: {loan.Collateral}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Statusi i aprovimit: {(loan.ApproveStatus ? "Pranuar" : "Në pritje")}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 30;

                // Seksioni: Menaxheri
                gfx.DrawString("Menaxheri përgjegjës:", headerFont, XBrushes.Black, new XPoint(40, y));
                y += 25;
                gfx.DrawString($"Emri: {loan.Manager?.name}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 20;
                gfx.DrawString($"Data e përgatitjes: {DateTime.Now.ToShortDateString()}", textFont, XBrushes.Black, new XPoint(60, y));
                y += 40;

                // Vijat e nënshkrimeve
                int signY = y;
                gfx.DrawLine(XPens.Black, 60, signY, 200, signY);
                gfx.DrawString("Nënshkrimi i Aplikuesit", textFont, XBrushes.Black, new XPoint(60, signY + 15));

                gfx.DrawLine(XPens.Black, page.Width - 200, signY, page.Width - 60, signY);
                gfx.DrawString("Nënshkrimi i Përgjegjësit", textFont, XBrushes.Black, new XPoint(page.Width - 200, signY + 15));

                // Footer (opsional)
                y = signY + 60;
                gfx.DrawLine(XPens.Black, 40, y, page.Width - 40, y);
                y += 20;
                gfx.DrawString("© 2025 NOVABANK - Dokument i përgatitur automatikisht", new XFont("Verdana", 10, XFontStyle.Italic), XBrushes.Gray, new XPoint(40, y));

                document.Save(ms);
                return ms.ToArray();
            }
        }
    }
}

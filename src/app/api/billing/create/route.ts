import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import path from "path";

// mapowanie polskich znaków na ASCII (do normalizacji etykiet)
function removeDiacritics(str: string) {
    const map: Record<string, string> = {
        "ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ż":"z","ź":"z",
        "Ą":"A","Ć":"C","Ę":"E","Ł":"L","Ń":"N","Ó":"O","Ś":"S","Ż":"Z","Ź":"Z"
    };
    return str.replace(/./g, ch => map[ch] ?? ch);
}

// funkcja do generowania tekstu bez "dziwnych" znaków w PDF (Twój oryginalny safeText)
function asciiFallback(str: string) {
    const map: Record<string, string> = {
        "ą":"a","ć":"c","ę":"e","ł":"l","ń":"n","ó":"o","ś":"s","ż":"z","ź":"z",
        "Ą":"A","Ć":"C","Ę":"E","Ł":"L","Ń":"N","Ó":"O","Ś":"S","Ż":"Z","Ź":"Z"
    };
    return str.replace(/[^A-Za-z0-9 -.,:()/]/g, ch => map[ch] ?? "");
}

// ---- Cena jednostkowa i jednostki (przykładowe).
// Dodaj tu realne wartości lub zamiast tego zrób fetch do API.
const canonicalPriceMap: Record<string, { unit: string, price: number }> = {
    // woda
    "woda": { unit: "m³", price: 10.5 },
    "water": { unit: "m³", price: 10.5 },

    // prąd
    "prad": { unit: "kWh", price: 0.85 },
    "prąd": { unit: "kWh", price: 0.85 },
    "electricity": { unit: "kWh", price: 0.85 },
    "electric": { unit: "kWh", price: 0.85 },

    // gaz
    "gaz": { unit: "m³", price: 6.2 },
    "gas": { unit: "m³", price: 6.2 },

    // centralne ogrzewanie - przykład (możesz zmienić jednostkę/cenę)
    "central heating": { unit: "GJ", price: 200 },
    "ogrzewanie": { unit: "GJ", price: 200 },
    "heat": { unit: "GJ", price: 200 },

    // śmieci / wywóz odpadów (przykład: cena za osobę/miesiąc)
    "garbage": { unit: "person", price: 30 },
    "smieci": { unit: "person", price: 30 },
    "śmieci": { unit: "person", price: 30 },

    // fundusz remontowy (przykład: zł / month)
    "repair fund": { unit: "month", price: 50 },
    "fundusz remontowy": { unit: "month", price: 50 }
};

// pomocnicza normalizacja etykiety do klucza (lowercase, bez diakrytyków, trim)
function normalizeLabel(raw: string) {
    if (!raw) return "";
    const trimmed = String(raw).trim();
    const noDiac = removeDiacritics(trimmed);
    return noDiac.toLowerCase();
}

// próba dopasowania label do priceData: exact match lub zawiera słowo kluczowe
function findPriceData(label: string) {
    const norm = normalizeLabel(label);

    // 1) exact
    if (canonicalPriceMap[norm]) return canonicalPriceMap[norm];

    // 2) spróbuj znaleźć klucz, który jest substringiem norm (np. "water" w "cold water")
    for (const key of Object.keys(canonicalPriceMap)) {
        if (norm.includes(key)) return canonicalPriceMap[key];
    }

    // 3) brak dopasowania
    return undefined;
}

export async function POST(req: Request) {
    try {
        const { userId, charges } = await req.json();

        const user = await prisma.users.findUnique({
            where: { id: userId },
            include: { apartment: { select: { number: true } } }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const pdf = await PDFDocument.create();
        const font = await pdf.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
        const safeText = (t: string) => asciiFallback(t);

        const page = pdf.addPage([595, 842]);
        const { width, height } = page.getSize();
        const margin = 40;

        // nagłówek
        page.drawText("CommunityCore", { x: margin, y: height - margin - 8, size: 20, font: fontBold, color: rgb(0.07,0.2,0.45) });
        const companyAddr = ["Wspólnota Mieszkaniowa", "Łukasińskiego 1/4", "71-215 Szczecin"];
        let compY = height - margin - 30;
        companyAddr.forEach(line => { page.drawText(safeText(line), { x: margin, y: compY, size: 10, font }); compY -= 12; });

        const dateStr = new Date().toLocaleDateString();
        page.drawText("Billing document", { x: margin, y: height - margin - 90, size: 16, font: fontBold });
        page.drawText(`Date: ${dateStr}`, { x: margin, y: height - margin - 110, size: 10, font });

        // dane odbiorcy
        let recipientY = height - margin - 140;
        page.drawText("Bill to:", { x: margin, y: recipientY, size: 11, font: fontBold });
        recipientY -= 14;
        page.drawText(`${user.first_name} ${user.second_name}`, { x: margin, y: recipientY, size: 10, font });
        recipientY -= 12;
        if (user.apartment?.number) { page.drawText(`Apt: ${user.apartment.number}`, { x: margin, y: recipientY, size: 10, font }); recipientY -= 12; }
        if ((user as any).email) { page.drawText((user as any).email, { x: margin, y: recipientY, size: 10, font }); recipientY -= 12; }

        // tabela
        const tableX = margin;
        let tableY = recipientY - 18;
        const tableWidth = width - margin * 2;
        const colWidths = {
            name: Math.floor(tableWidth * 0.55),
            qty: Math.floor(tableWidth * 0.12),
            unit: Math.floor(tableWidth * 0.13),
            amount: Math.floor(tableWidth * 0.2),
        };

        // nagłówki kolumn
        page.drawText("Description", { x: tableX + 6, y: tableY - 8, size: 10, font: fontBold });
        page.drawText("Qty", { x: tableX + colWidths.name + 6, y: tableY - 8, size: 10, font: fontBold });
        page.drawText("Unit", { x: tableX + colWidths.name + colWidths.qty + 6, y: tableY - 8, size: 10, font: fontBold });
        page.drawText("Amount (PLN)", { x: tableX + colWidths.name + colWidths.qty + colWidths.unit + 6, y: tableY - 8, size: 10, font: fontBold });

        tableY -= 30;
        let total = 0;

        // zabezpieczenie na wypadek, gdy charges nie jest tablicą
        const items = Array.isArray(charges) ? charges : [];

        items.forEach((item: any) => {
            const rawLabel = String(item.label ?? "");
            const label = rawLabel;
            const amountNum = Number(String(item.amount).replace(",", ".") || 0);

            // znajdź dane cenowe (jeśli są)
            const priceData = findPriceData(label);

            let qtyDisplay = "-";
            let unitDisplay = "";

            if (!isNaN(amountNum) && amountNum > 0 && priceData && priceData.price > 0) {
                const qty = amountNum / priceData.price;
                // formatuj: jeśli <1 -> 3 miejsca po przecinku, inaczej 2 miejsca
                qtyDisplay = qty < 1 ? qty.toFixed(3) : qty.toFixed(2);
                unitDisplay = priceData.unit;
            } else {
                // fallback: jeśli admin nie podał etykiety, zostaw "-"; jeśli jest zero/nieprawidłowa kwota -> 0.00
                qtyDisplay = (isNaN(amountNum) || amountNum <= 0) ? "-" : "1";
                unitDisplay = priceData ? priceData.unit : "";
            }

            page.drawText(safeText(String(rawLabel)), { x: tableX + 6, y: tableY - 6, size: 10, font });
            page.drawText(qtyDisplay, { x: tableX + colWidths.name + 6, y: tableY - 6, size: 10, font });
            page.drawText(unitDisplay, { x: tableX + colWidths.name + colWidths.qty + 6, y: tableY - 6, size: 10, font });
            page.drawText((isNaN(amountNum) ? 0 : amountNum).toFixed(2), { x: tableX + colWidths.name + colWidths.qty + colWidths.unit + 6, y: tableY - 6, size: 10, font });

            total += (isNaN(amountNum) ? 0 : amountNum);
            tableY -= 20;
        });

        // suma
        page.drawText("Total:", { x: tableX + colWidths.name + colWidths.qty + colWidths.unit - 60, y: tableY - 2, size: 12, font: fontBold });
        page.drawText(total.toFixed(2) + " PLN", { x: tableX + colWidths.name + colWidths.qty + colWidths.unit + 6, y: tableY - 2, size: 12, font: fontBold });

        // zapis PDF
        const pdfBytes = await pdf.save();
        const dirPath = path.join(process.cwd(), "public", "documents");
        await mkdir(dirPath, { recursive: true });
        const filename = `billing_${Date.now()}.pdf`;
        const filePath = path.join(dirPath, filename);
        await writeFile(filePath, pdfBytes);

        // zapis w bazie
        await prisma.billingDocument.create({
            data: { user_id: userId, url: `/documents/${filename}` }
        });

        return NextResponse.json({ success: true, url: `/documents/${filename}` });
    } catch (err) {
        console.error("Error generating billing PDF:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

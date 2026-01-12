
"use client";

import React, { useState } from 'react';

export default function TestNamingPage() {
    const [msg, setMsg] = useState("");

    const testTextDownload = () => {
        const content = "This is a dummy DOCX content (actually text).";
        const blob = new Blob([content], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "TEST_EXT_TEXT.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMsg("ÄÃ£ thá»­ táº£i file TEXT giáº£ DOCX. HÃ£y xem tÃªn file cÃ³ pháº£i lÃ  TEST_EXT_TEXT.docx khÃ´ng.");
    };

    const testRealDocxDownload = async () => {
        // We'll try to import docx dynamically to minimize issues
        const docx = await import("docx");
        const doc = new docx.Document({
            sections: [{
                children: [new docx.Paragraph({ text: "Hello World" })]
            }]
        });
        const blob = await docx.Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "TEST_REAL_DOCX.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMsg("ÄÃ£ thá»­ táº£i file DOCX tháº­t. HÃ£y xem tÃªn file cÃ³ pháº£i lÃ  TEST_REAL_DOCX.docx khÃ´ng.");
    };

    return (
        <div className="p-20 space-y-10">
            <h1 className="text-2xl font-bold">Kiá»ƒm tra cÆ¡ cháº¿ táº£i file (GUID vs Name)</h1>
            <div className="flex gap-4">
                <button
                    onClick={testTextDownload}
                    className="p-4 bg-slate-200 rounded-lg"
                >
                    1. Táº£i Text giáº£ lÃ m DOCX
                </button>
                <button
                    onClick={testRealDocxDownload}
                    className="p-4 bg-blue-600 text-white rounded-lg"
                >
                    2. Táº£i DOCX tháº­t (ThÆ° viá»‡n docx)
                </button>
            </div>
            {msg && <p className="p-4 bg-emerald-50 rounded-lg">{msg}</p>}
        </div>
    );
}

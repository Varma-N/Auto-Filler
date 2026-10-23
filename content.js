chrome.runtime.onMessage.addListener(async (request) => {
    if (request.action === "fill") {
        await fillEverything();
    }
});

async function fillEverything() {
    try {
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

// THE FIX: This function bypasses React's event wrappers to force the value into the state
function setReactValue(element, value) {
    if (!element || !value) return;

    element.removeAttribute("readonly");
    element.removeAttribute("disabled");
    element.focus();

    // Bypass React's internal value tracker
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
    nativeInputValueSetter.call(element, value);

    // Dispatch native events so React registers the keystrokes
    element.dispatchEvent(new Event("input", { bubbles: true }));
    element.dispatchEvent(new Event("change", { bubbles: true }));
    element.blur();
}

function fill(selector, value) {
    if (!value) return;
    const element = document.querySelector(selector);
    if (element) {
        setReactValue(element, value);
    }
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

    // Matches the exact container class in the provided HTML
    const sections = document.querySelectorAll(".pilDetails_mainContainer__HPFSL");

    for (let index = 0; index < sections.length; index++) {
        if (index >= formData.pilgrims.length) break;

        const section = sections[index];
        const person = formData.pilgrims[index];

        set(section, 'input[name="name"]', person.name);
        set(section, 'input[name="age"]', person.age);
        
        // Handle TTD's Custom Dropdowns
        await selectDropdown(section, 'input[name="gender"]', person.gender);
        await selectDropdown(section, 'input[name="idType"]', person.idType);
        
        // Wait briefly for the ID Number box to unlock after selecting ID Type
        await sleep(200); 
        set(section, 'input[name="idNumber"]', person.idNumber);
    }
}

function set(parent, selector, value) {
    if (!value) return;
    const input = parent.querySelector(selector);
    if (input) {
        setReactValue(input, value);
    }
}

async function selectDropdown(parent, selector, value) {
    if (!value) return;
    const input = parent.querySelector(selector);
    if (!input) return;

    // Click the dummy input to open the dropdown menu
    input.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
    input.click();

    let options = [];
    // Wait for the dropdown list items to appear in the DOM
    for (let i = 0; i < 30; i++) { 
        options = document.querySelectorAll("li.floatingDropdown_listItem__tU_5x");
        if (options.length) break;
        await sleep(20);
    }

    // Find and click the matching option
    for (const option of options) {
        if (option.textContent.trim().toLowerCase() === value.trim().toLowerCase()) {
            option.click();
            await sleep(100); // Small pause to let React close the dropdown gracefully
            return;
        }
    }
    console.log(value + " not found in dropdown");
}

// ---------------- UI BUTTON ---------------- 
createFloatingButton();

function createFloatingButton() {
    if (document.getElementById("ttd-auto-fill-btn")) return;

    const button = document.createElement("button");
    button.id = "ttd-auto-fill-btn";
    button.innerHTML = "⚡";
    button.title = "TTD Auto Fill";

    button.style.position = "fixed";
    button.style.top = "50%";
    button.style.right = "20px";
    button.style.transform = "translateY(-50%)";
    button.style.width = "60px";
    button.style.height = "60px";
    button.style.border = "none";
    button.style.borderRadius = "50%";
    button.style.background = "#663399";
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
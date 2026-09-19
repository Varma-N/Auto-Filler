document.addEventListener('DOMContentLoaded', loadData);

document.getElementById('saveBtn').addEventListener('click', () => {
    const data = {
        general: {
            email: document.getElementById('email').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            country: document.getElementById('country').value,
            pincode: document.getElementById('pincode').value
        },
        pilgrims: []
    };

    // Add Pilgrim 1
    const p1Name = document.getElementById('p1_name').value;
    if (p1Name) {
        data.pilgrims.push({
            name: p1Name,
            age: document.getElementById('p1_age').value,
            gender: document.getElementById('p1_gender').value,
            idType: document.getElementById('p1_idType').value,
            idNumber: document.getElementById('p1_idNumber').value
        });
    }

    // Add Pilgrim 2
    const p2Name = document.getElementById('p2_name').value;
    if (p2Name) {
        data.pilgrims.push({
            name: p2Name,
            age: document.getElementById('p2_age').value,
            gender: document.getElementById('p2_gender').value,
            idType: document.getElementById('p2_idType').value,
            idNumber: document.getElementById('p2_idNumber').value
        });
    }

    chrome.storage.local.set({ ttdData: data }, () => {
        const textSpan = document.querySelector('#saveBtn span');
        textSpan.textContent = "Saved!";
        setTimeout(() => textSpan.textContent = "Save", 2000);
    });
});

document.getElementById('clearBtn').addEventListener('click', () => {
    if(confirm("Are you sure you want to delete all saved details?")) {
        chrome.storage.local.remove('ttdData', () => {
            document.querySelectorAll('input').forEach(input => input.value = '');
            document.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            const textSpan = document.querySelector('#clearBtn span');
            textSpan.textContent = "Cleared!";
            setTimeout(() => textSpan.textContent = "Clear", 2000);
        });
    }
});

document.getElementById('fillBtn').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "fill" });
    });
});

function loadData() {
    chrome.storage.local.get(['ttdData'], (result) => {
        if (result.ttdData) {
            const data = result.ttdData;
            
            // Load General
            if(data.general) {
                document.getElementById('email').value = data.general.email || '';
                document.getElementById('city').value = data.general.city || '';
                document.getElementById('state').value = data.general.state || '';
                document.getElementById('country').value = data.general.country || 'India';
                document.getElementById('pincode').value = data.general.pincode || '';
            }

            // Load Pilgrims
            if(data.pilgrims && data.pilgrims[0]) {
                document.getElementById('p1_name').value = data.pilgrims[0].name || '';
                document.getElementById('p1_age').value = data.pilgrims[0].age || '';
                document.getElementById('p1_gender').value = data.pilgrims[0].gender || '';
                document.getElementById('p1_idType').value = data.pilgrims[0].idType || '';
                document.getElementById('p1_idNumber').value = data.pilgrims[0].idNumber || '';
            }
            if(data.pilgrims && data.pilgrims[1]) {
                document.getElementById('p2_name').value = data.pilgrims[1].name || '';
                document.getElementById('p2_age').value = data.pilgrims[1].age || '';
                document.getElementById('p2_gender').value = data.pilgrims[1].gender || '';
                document.getElementById('p2_idType').value = data.pilgrims[1].idType || '';
                document.getElementById('p2_idNumber').value = data.pilgrims[1].idNumber || '';
            }
        }
    });
}
// Kayıt ekleme fonksiyonu
function addCountdown() {
    const eventName = document.getElementById("name").value;
    const targetDate = document.getElementById("date-input").value;
    
    if (!(eventName && targetDate)) {
        alert("Etkinlik adı veya tarihini girin.");
        return;
    }

    //发现时间有差 确保目标日期为午夜时间
    const eventDate = new Date(targetDate);
    eventDate.setHours(0, 0, 0, 0); // 将时间部分设置为00:00:00

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // 将当前时间设置为00:00:00，避免影响计算
    const timeDiff = eventDate - currentDate;
    const dayDiff = Math.floor(timeDiff / (3600 * 1000 * 24));
    
    displayRecord(eventName, dayDiff);

    const saveRecord = { eventName: eventName, dayDiff: dayDiff }; 
    const records = JSON.parse(localStorage.getItem('records')) || [];
    records.push(saveRecord);
    localStorage.setItem('records', JSON.stringify(records));  
}

// Sayfa yüklendiğinde verileri yükle
function loadrecords() {        
    const records = JSON.parse(localStorage.getItem('records')) || [];
    records.forEach(record => {
        displayRecord(record.eventName, record.dayDiff);
    });
}
window.onload = loadrecords;

// Etkinlik ve gün farkını ekranda gösterme fonksiyonu
function displayRecord(eventName, dayDiff) {
    let countdownText;
    let countupText;

    // Gün farkını kontrol et
    if (dayDiff > 0) {
        countdownText = `${eventName} için ${dayDiff} gün kaldı`;
    } else if (dayDiff < 0) {
        countupText = `${eventName} ${Math.abs(dayDiff)} gün önceydi`;
    } else {
        countdownText = `${eventName} bugünde!`;
    }

    const countdownDiv = document.createElement("div");
    countdownDiv.classList.add("countdown-item");

    const countdownContent = document.createElement("span");
    countdownContent.classList.add("countdown-box");
    countdownContent.textContent = countdownText;

    const countupContent = document.createElement("span");
    countupContent.classList.add("countup-box");
    countupContent.textContent = countupText;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.onclick = function() {
        removeRecord(eventName, dayDiff, countdownDiv);
    }

    countdownDiv.appendChild(countdownContent);
    countdownDiv.appendChild(countupContent);
    countdownDiv.appendChild(deleteBtn);

    const countdownContainer = document.getElementById("countdowns");
    countdownContainer.appendChild(countdownDiv);
}

// Kayıt silme fonksiyonu
function removeRecord(eventName, dayDiff, countdownDiv) {
    const records = JSON.parse(localStorage.getItem('records')) || [];
    const updatedRecords = records.filter(record => !(record.eventName === eventName && record.dayDiff === dayDiff));
    localStorage.setItem('records', JSON.stringify(updatedRecords));
    countdownDiv.remove();
}

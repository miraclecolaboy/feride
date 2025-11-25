// Depolanan etkinlik listesini al (localStorage'dan)
function getStoredEvents() {
    const storedEvents = localStorage.getItem("events");
    // Eğer etkinlik yoksa, boş bir dizi döndür
    return storedEvents ? JSON.parse(storedEvents) : [];
}

// Etkinlik listesini localStorage'a kaydet
function saveEvents(events) {
    localStorage.setItem("events", JSON.stringify(events));
}

// Yeni etkinlik ekleme
function addEvent() {
    const eventName = document.getElementById("eventName").value;
    const eventDate = new Date(document.getElementById("eventDate").value).getTime();

    if (!eventName || !eventDate) {
        alert("Etkinlik adı ve tarihi giriniz.");
        return;
    }

    const events = getStoredEvents();  // Mevcut etkinlikleri al
    events.push({ name: eventName, date: eventDate });  // Yeni etkinlik ekle
    saveEvents(events);  // Güncellenmiş etkinlikleri kaydet

    displayLists();  // Etkinlik listesini güncelle
    document.getElementById("eventName").value = '';  // Girdi kutusunu temizle
    document.getElementById("eventDate").value = '';  // Tarih kutusunu temizle
}

// Etkinlik listesini render et (geri sayım ve anılar)
function displayLists() {
    const events = getStoredEvents();  // Depolanan etkinlikleri al

    const countdownList = document.getElementById("countdownList");
    const countupList = document.getElementById("countupList");

    countdownList.innerHTML = '';
    countupList.innerHTML = '';

    events.forEach((event, index) => {
        const countdownItem = createListItem(event, 'countdown', index);
        const countupItem = createListItem(event, 'countup', index);

        // Eğer etkinlik geri sayımda ise, geri sayım bölgesine ekle
        if (event.date > Date.now()) {
            countdownList.appendChild(countdownItem);
        } 
        // Eğer etkinlik anıdaysa, anı bölgesine ekle
        else {
            countupList.appendChild(countupItem);
        }
    });
}

// Liste öğesi oluştur (geri sayım veya anı)
function createListItem(event, type, index) {
    const li = document.createElement("li");  // Yeni <li> öğesi oluştur
    const timeDiff = Date.now() - event.date;  // Mevcut zaman ile etkinlik zamanı arasındaki farkı hesapla

    // Türüne göre gün sayısını hesapla: geri sayım ve anılar için farklı hesaplamalar
    let days = type === 'countdown'
        ? Math.ceil((event.date - Date.now()) / (1000 * 3600 * 24))  // Geri sayım: etkinlik tarihi ile mevcut tarih arasındaki fark
        : Math.floor(timeDiff / (1000 * 3600 * 24));  // Anılar: mevcut tarih ile etkinlik tarihi arasındaki fark

    // <li> öğesinin içeriğini ayarla: etkinlik adı ve gün sayısı
    li.textContent = `${event.name} - ${type === 'countdown' ? 'Kalan' : 'Geçen'} ${days} Gün`;

    // Silme düğmesi oluştur
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Sil";
    deleteBtn.onclick = () => deleteEvent(index);  // Düğmeye tıklandığında etkinliği sil

    li.appendChild(deleteBtn);  // Silme düğmesini <li> öğesine ekle
    return li;  // Oluşturduğumuz <li> öğesini döndür
}

// Sayfa yüklendiğinde: Etkinlik listesini göster
document.addEventListener("DOMContentLoaded", function () {
    displayLists();  // Sayfa yüklendiğinde etkinlik listesini render et
});

// Etkinlik silme
function deleteEvent(index) {
    const events = getStoredEvents();  // Mevcut etkinlik listesini al
    events.splice(index, 1);  // Belirtilen indeksteki etkinliği sil
    saveEvents(events);  // Güncellenmiş etkinlikleri kaydet
    displayLists();  // Etkinlik listesini güncelle
}

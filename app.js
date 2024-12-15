
// app.js

const apiKey = 'YOUR_API_KEY'; // Alpha Vantage API Key'inizi buraya koyun

// Piyasa verilerini çekmek için
function fetchMarketPrices() {
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=5min&apikey=${apiKey}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data['Time Series (5min)']) {
        const latestTime = Object.keys(data['Time Series (5min)'])[0];
        const latestPrice = data['Time Series (5min)'][latestTime]['4. close'];
        
        // Veriyi işleyip ekrana yazdır
        console.log(`Latest price of AAPL: $${latestPrice}`);
        
        // Fiyatı ekranda göster
        updatePriceDisplay(latestPrice);
      } else {
        console.error('Error fetching market data');
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Fiyatı ekranda gösteren fonksiyon
function updatePriceDisplay(price) {
  const priceElement = document.getElementById('asset-price');
  priceElement.innerText = `Current Price: $${price}`;
}

// Portföyü ve işlemleri yönetmek
let portfolio = {
  cash: 100000, // Başlangıçta 100.000$ sanal para
  assets: []
};

// Portföyü ekranda gösteren fonksiyon
function renderPortfolio() {
  const portfolioDetails = document.getElementById('portfolio-details');
  portfolioDetails.innerHTML = `<p>Cash: $${portfolio.cash}</p>`;
  portfolio.assets.forEach(asset => {
    portfolioDetails.innerHTML += `<p>${asset.name}: ${asset.amount} shares, Total: $${(asset.amount * asset.price).toFixed(2)}</p>`;
  });
}

// Bir varlık satın almak
function buyAsset() {
  const selectedAsset = { symbol: 'AAPL', name: 'Apple', price: 150 }; // Örnek olarak Apple alıyoruz
  const amountToBuy = 10; // 10 hisse alıyoruz
  const totalCost = amountToBuy * selectedAsset.price;
  if (portfolio.cash >= totalCost) {
    portfolio.cash -= totalCost;
    const existingAsset = portfolio.assets.find(a => a.name === selectedAsset.name);
    if (existingAsset) {
      existingAsset.amount += amountToBuy;
    } else {
      portfolio.assets.push({ name: selectedAsset.name, amount: amountToBuy, price: selectedAsset.price });
    }
    renderPortfolio();
  } else {
    alert("Insufficient funds!");
  }
}

// Bir varlık satmak
function sellAsset() {
  const selectedAsset = portfolio.assets[0]; // İlk varlığı satıyoruz
  const amountToSell = 5; // 5 hisse satıyoruz
  if (selectedAsset.amount >= amountToSell) {
    selectedAsset.amount -= amountToSell;
    const totalSale = amountToSell * selectedAsset.price;
    portfolio.cash += totalSale;
    renderPortfolio();
  } else {
    alert("Not enough shares to sell!");
  }
}

// İşlem butonlarını ayarla
document.getElementById('buy-btn').addEventListener('click', buyAsset);
document.getElementById('sell-btn').addEventListener('click', sellAsset);

// Başlangıçta piyasa verisini çek
fetchMarketPrices();

// Her 5 dakikada bir veriyi güncelle
setInterval(fetchMarketPrices, 300000);  // 300000 ms = 5 dakika

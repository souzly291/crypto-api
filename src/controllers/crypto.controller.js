import db from '../db.js';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

export const getCryptoPrices = (req, res) => {
  // 1. PASO: Consultar Base de Datos Local
  db.all("SELECT * FROM coins", [], async (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Error de base de datos" });
    }

    // 2. PASO: Si hay datos locales, devolverlos (Caché Local)
    if (rows.length > 0) {
      console.log("✅ Sirviendo desde SQLite (Copia Local)");
      return res.json({
        source: "local_database",
        data: rows
      });
    }

    // 3. PASO: Si está vacío, consultar API Externa
    console.log("🌍 BD vacía. Consultando API externa (CoinGecko)...");
    
    try {
      const response = await fetch(COINGECKO_URL);
      const data = await response.json();

      // Mapeamos solo lo que nos interesa
      const coinsToSave = data.map(coin => ({
        name: coin.name,
        symbol: coin.symbol,
        price: coin.current_price
      }));

      // 4. PASO: Guardar copia en SQLite
      const insert = db.prepare("INSERT INTO coins (name, symbol, price_usd) VALUES (?, ?, ?)");
      
      coinsToSave.forEach(coin => {
        insert.run(coin.name, coin.symbol, coin.price);
      });
      
      insert.finalize();

      // Devolvemos los datos recién bajados
      res.json({
        source: "external_api",
        data: coinsToSave
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Falló la conexión con la API externa" });
    }
  });
};

// Extra: Endpoint para borrar la BD y forzar nueva descarga (útil para pruebas)
export const clearLocalData = (req, res) => {
  db.run("DELETE FROM coins", (err) => {
    if (err) return res.status(500).json({ error: "No se pudo limpiar la BD" });
    res.json({ message: "Base de datos local limpiada. La próxima petición irá a la API externa." });
  });
};
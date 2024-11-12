const express = require('express');
const oracledb = require('oracledb');
const cors = require('cors');

const app = express();
const port = 3001;

// Habilitar CORS para permitir solicitudes desde la app móvil
app.use(cors());

// Configuración de la conexión Oracle
const poolConfig = {
    user: 'DEMO2024',
    password: 'Chileduoc@2024',
    connectString: 'adb.us-phoenix-1.oraclecloud.com:1522/ga7977f7959473f_baseprueba_high.adb.oraclecloud.com',
    wallet: 'C:/Wallet_BASEPRUEBA/ewallet.pem',
    poolMin: 1,       // Número mínimo de conexiones en el pool
    poolMax: 10,      // Número máximo de conexiones en el pool
    poolIncrement: 1, // Cuántas conexiones agregar cuando se necesiten más
    poolTimeout: 60,  // Tiempo máximo de espera para obtener una conexión
    stmtCacheSize: 30, // Tamaño del cache de declaraciones
    maxIdleTime: 60   // Tiempo máximo de inactividad para las conexiones
};

let pool;

async function start() {
    try {
        // Crear el pool de conexiones
        pool = await oracledb.createPool(poolConfig);
        console.log('Pool de conexiones creado');
    } catch (err) {
        console.error('Error al crear el pool de conexiones:', err);
    }
}

// Ruta para obtener usuarios
app.get('/usuarios', async (req, res) => {
    let connection;
    try {
        console.log('Conectando a la base de datos...');
        connection = await pool.getConnection();  // Usar el pool

        // Ejecutar consulta
        const result = await connection.execute('SELECT * FROM usuarios');

        // Enviar respuesta con los datos
        res.json(result.rows);
    } catch (err) {
        console.error('Error al conectarse a la base de datos:', err);
        res.status(500).json({ error: 'Error al acceder a la base de datos', details: err });
    } finally {
        if (connection) {
            try {
                await connection.close(); // Cerrar la conexión
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
});

// Iniciar el servidor y el pool
start().then(() => {
    app.listen(port, () => {
        console.log(`Servidor backend corriendo en http://localhost:${port}`);
    });
});

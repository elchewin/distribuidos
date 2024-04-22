const express = require('express');
const redis = require('redis');
const { Pool } = require('pg');

const app = express();

const client_redis = await redis.createClient({
    host: "prueba_redis_1", //CAMBIAR A NOMBRE DE CARPETA DE GITHUB
    port: 6379,
});

const pool = new Pool({
    user: 'user',
    host: 'prueba_postgres_1', //CAMBIAR A NOMBRE DE CARPETA DE GITHUB
    database: 'Corredores',
    password: 'password',
    port: 5432,
});

app.get('/corredores', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM corredores');
        const corredores = result.rows;
        client.release();
        res.json(corredores);
    } catch (err) {
        console.error('Error al obtener corredores', err);
        res.status(500).json({ error: 'Error al obtener corredores' });
    }
});

app.get('/corredor/:id', async (req, res) => {
    const corredorId = req.params.id;

    client_redis.get(corredorId, async (err, data) => {
        if (err) throw err;

        if (data !== null) {
            res.json(JSON.parse(data));
        } else {
            try {
                const client = await pool.connect();
                const result = await client.query('SELECT * FROM corredores WHERE id = $1', [corredorId]);
                const corredor = result.rows;
                client.release();

                if (corredor) {
                    client_redis.setex(corredorId, 3600, JSON.stringify(corredor));
                    res.json(corredor);
                } else {
                    res.status(404).json({ error: 'Corredor no encontrado' });
                }
            } catch (err) {
                console.error('Error al buscar corredor por ID', err);
                res.status(500).json({ error: 'Error al buscar corredor por ID' });
            } finally {
                client_redis.quit();
            }
        }
    });
});

app.listen(3000, () => {
    console.log('Servidor Express corriendo en el puerto 3000');
});
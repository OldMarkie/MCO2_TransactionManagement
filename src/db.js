const mysql = require('mysql2');
const util = require('util');

// Database configurations for three nodes
const dbConfigs = [
    {
        host: 'ccscloud.dlsu.edu.ph',
        user: 'username',
        password: 'password',
        database: 'Complete',
        port: 20060
    },
    {
        host: 'ccscloud.dlsu.edu.ph',
        user: 'username',
        password: 'password',
        database: 'Be1980',
        port: 20070
    },
    {
        host: 'ccscloud.dlsu.edu.ph',
        user: 'username',
        password: 'password',
        database: 'Af1980',
        port: 20080
    }
];

const pools = dbConfigs.map(config => mysql.createPool(config));
const queryPools = pools.map(pool => util.promisify(pool.query).bind(pool));

// Function to get a query pool based on some criteria
const getQueryPool = () => {
    // For simplicity, this example just cycles through the pools
    const index = Math.floor(Math.random() * pools.length);
    return queryPools[index];
};

// Begin transaction with specified isolation level
const beginTransaction = async (isolationLevel) => {
    const pool = getQueryPool();
    const connection = await pool.getConnection();
    await connection.query(`SET SESSION transaction_isolation = '${isolationLevel}'`);
    await connection.beginTransaction();
    return connection;
};

// Commit transaction
const commitTransaction = async (connection) => {
    await connection.commit();
    connection.release();
};

// Rollback transaction
const rollbackTransaction = async (connection) => {
    await connection.rollback();
    connection.release();
};

module.exports = {
    query: async (sql, params) => {
        const pool = getQueryPool();
        try {
            return await pool(sql, params);
        } catch (error) {
            console.error('Database query error:', error.message);
            throw error;
        }
    },
    beginTransaction,
    commitTransaction,
    rollbackTransaction
};

//use this file if you are using the database is Oracle Database
const oracledb = require('oracledb');

// Database config.
const dbConfig = {
    user: "system",
    password: "manager",
    host: "localhost:1521/xe"
}
//Query Running Function
const Query = async (sql) => {
    let connection;
    try {
        connection = await oracledb.getConnection(dbConfig);
        const result = await connection.execute(sql, [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        await connection.commit();
        return result; 
    } catch (error) {
        return (error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error(error);
            }
        }
    }
};
module.exports = Query;
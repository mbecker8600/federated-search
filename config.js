var config = {
    small: {
        driver: 'msnodesqlv8',
        database: 'smallpoc',
        server: 'MICHAEL\\SQLEXPRESS',
        options: {
            trustedConnection: true
        }
    },
    medium: {
        driver: 'msnodesqlv8',
        database: 'mediumpoc',
        server: 'MICHAEL\\SQLEXPRESS',
        options: {
            trustedConnection: true
        }
    },
    large: {
        driver: 'msnodesqlv8',
        database: 'largepoc',
        server: 'MICHAEL\\SQLEXPRESS',
        options: {
            trustedConnection: true
        }
    }
};
module.exports = config;
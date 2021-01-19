function conn = dbconn()
persistent dbready;
if isempty(dbready)
    opts = configureJDBCDataSource('Vendor','MySQL')';
    opts = setConnectionOptions(opts, ...
    'DatabaseName','brain',...
    'DataSourceName','brain', ...
    'Server','unknown','PortNumber',3306, ...
    'JDBCDriverLocation','F:\matlab19b\db_jdbc_driver\mysql-connector-java-8.0.19.jar');
    saveAsJDBCDataSource(opts);
    dbready=1; 
end
username = "unknown";
password = "unknown";
conn = database('brain',username,password);
end
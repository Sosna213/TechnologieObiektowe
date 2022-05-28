package com.project.GraphicalQueryGenerator.Service;

import com.project.GraphicalQueryGenerator.DTO.DatabaseSchemaDTO;
import com.project.GraphicalQueryGenerator.DTO.TableDTO;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class DatabaseService {

    private final String databaseUrl = "jdbc:postgresql://localhost:5432/VotingApplication";
    private final String user = "postgres";
    private final String password = "1234";


    public DatabaseSchemaDTO getDatabaseSchema() {
        DatabaseSchemaDTO databaseSchemaDTO = new DatabaseSchemaDTO();
        ArrayList<TableDTO> tableDTOS = new ArrayList<>();
        try {
            Class.forName("org.postgresql.Driver");
            Connection connection = DriverManager.getConnection(databaseUrl, user, password);
            DatabaseMetaData dbMetaData = connection.getMetaData();
            ResultSet rs = connection.getMetaData().getTables(null, null, null, new String[]{"TABLE"});
            while (rs.next()) {
                TableDTO tableDTO = new TableDTO();
                tableDTO.setName(rs.getString("TABLE_NAME"));

                ResultSet columns = connection.getMetaData().getColumns(null, null, rs.getString("TABLE_NAME"), null);
                ArrayList<String> columnsToAdd = new ArrayList<>();
                while (columns.next()) {
                    columnsToAdd.add(columns.getString("COLUMN_NAME"));
                }
                tableDTO.setColumns(columnsToAdd);
                ArrayList<String> primaryKeys = new ArrayList<>();

                ResultSet PK = connection.getMetaData().getPrimaryKeys(null, null, rs.getString("TABLE_NAME"));
                while (PK.next()) {
                    primaryKeys.add(PK.getString("COLUMN_NAME") + "===" + PK.getString("PK_NAME"));
                }
                tableDTO.setPrimaryKeys(primaryKeys);
                ArrayList<String> foreignKeys = new ArrayList<>();

                ResultSet FK = connection.getMetaData().getImportedKeys(null, null, rs.getString("TABLE_NAME"));
                while (FK.next()) {
                    foreignKeys.add(FK.getString("PKTABLE_NAME") + "---" + FK.getString("PKCOLUMN_NAME") + "===" + FK.getString("FKTABLE_NAME") + "---" + FK.getString("FKCOLUMN_NAME"));
                }
                tableDTO.setForeignKeys(foreignKeys);
                tableDTOS.add(tableDTO);
            }
            databaseSchemaDTO.setTableDTOS(tableDTOS);
        } catch (ClassNotFoundException | SQLException e) {
            System.out.println(e.getMessage());
        }
        return databaseSchemaDTO;
    }

    public JSONArray getDataUsingSelect(String SQL){
        JSONArray json = new JSONArray();
        try{
            Class.forName("org.postgresql.Driver");
            Connection connection = DriverManager.getConnection(databaseUrl, user, password);
            Statement stmt = connection.createStatement();
            ResultSet rs = stmt.executeQuery(SQL);

            ResultSetMetaData rsmd = rs.getMetaData();
            while(rs.next()){
                int numColumns = rsmd.getColumnCount();
                JSONObject obj = new JSONObject();

                for (int i=1; i<numColumns+1; i++) {
                    String column_name = rsmd.getColumnName(i);
                    if(rsmd.getColumnType(i)==java.sql.Types.ARRAY){
                        obj.put(column_name, rs.getArray(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.BIGINT){
                        obj.put(column_name, rs.getInt(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.BOOLEAN){
                        obj.put(column_name, rs.getBoolean(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.BLOB){
                        obj.put(column_name, rs.getBlob(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.DOUBLE){
                        obj.put(column_name, rs.getDouble(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.FLOAT){
                        obj.put(column_name, rs.getFloat(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.INTEGER){
                        obj.put(column_name, rs.getInt(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.NVARCHAR){
                        obj.put(column_name, rs.getNString(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.VARCHAR){
                        obj.put(column_name, rs.getString(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.TINYINT){
                        obj.put(column_name, rs.getInt(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.SMALLINT){
                        obj.put(column_name, rs.getInt(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.DATE){
                        obj.put(column_name, rs.getDate(column_name));
                    }
                    else if(rsmd.getColumnType(i)==java.sql.Types.TIMESTAMP){
                        obj.put(column_name, rs.getTimestamp(column_name));
                    }
                    else{
                        obj.put(column_name, rs.getObject(column_name));
                    }
                }
                json.put(obj);
            }
        }
        catch (ClassNotFoundException | SQLException | JSONException e) {
            System.out.println(e.getMessage());
        }
        return json;
    }
}

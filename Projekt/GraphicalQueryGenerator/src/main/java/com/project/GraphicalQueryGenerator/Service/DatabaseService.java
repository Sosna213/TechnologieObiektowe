package com.project.GraphicalQueryGenerator.Service;

import com.project.GraphicalQueryGenerator.DTO.DatabaseSchemaDTO;
import com.project.GraphicalQueryGenerator.DTO.TableDTO;
import lombok.RequiredArgsConstructor;
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
}

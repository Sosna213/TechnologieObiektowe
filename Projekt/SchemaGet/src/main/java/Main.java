import java.sql.*;

public class Main {
    public static void main(String[] args) throws ClassNotFoundException, SQLException{
        Class.forName("org.postgresql.Driver");
        Connection connection = DriverManager.getConnection("jdbc:postgresql://localhost:5432/VotingApplication", "postgres", "1234");

        DatabaseMetaData dbMetaData = connection.getMetaData();
        ResultSet rs = connection.getMetaData().getTables(null, null, null, new String[]{"TABLE"});
        while (rs.next()) {
            System.out.println("Table Name - " + rs.getString("TABLE_NAME"));
            System.out.println("Columns:");

            ResultSet columns = connection.getMetaData().getColumns(null,null, rs.getString("TABLE_NAME"), null);
            while(columns.next())
            {
                String columnName = columns.getString("COLUMN_NAME");
                System.out.println("    "+columnName);
            }

            ResultSet PK = connection.getMetaData().getPrimaryKeys(null,null, rs.getString("TABLE_NAME"));
            System.out.println("\n------------PRIMARY KEYS-------------");
            while(PK.next())
            {
                System.out.println(PK.getString("COLUMN_NAME") + "===" + PK.getString("PK_NAME"));
            }

            ResultSet FK = connection.getMetaData().getImportedKeys(null, null, rs.getString("TABLE_NAME"));
            System.out.println("\n------------FOREIGN KEYS-------------");
            while(FK.next())
            {
                System.out.println(FK.getString("PKTABLE_NAME") + "---" + FK.getString("PKCOLUMN_NAME") + "===" + FK.getString("FKTABLE_NAME") + "---" + FK.getString("FKCOLUMN_NAME"));
            }
            System.out.println();
        }


    }
}

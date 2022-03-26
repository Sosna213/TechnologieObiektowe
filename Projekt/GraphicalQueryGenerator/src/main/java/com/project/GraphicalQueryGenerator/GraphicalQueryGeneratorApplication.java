package com.project.GraphicalQueryGenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.sql.*;

@SpringBootApplication
public class GraphicalQueryGeneratorApplication {

    public static void main(String[] args) {
        SpringApplication.run(GraphicalQueryGeneratorApplication.class, args);

        Connection connection = null;
        try {
            // Loading driver
            Class.forName("com.mysql.jdbc.Driver");
            // Creating connection
            connection = DriverManager.getConnection("jdbc:mysql://localhost:3306",
                    "root", "admin");
            // Getting DatabaseMetaData object
            DatabaseMetaData dbMetaData = connection.getMetaData();

            // getting Database Schema Names
            ResultSet rs = connection.getMetaData().getCatalogs();
            while (rs.next()) {
                System.out.println("Schema Name - " + rs.getString("TABLE_CAT"));
            }

        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } catch (SQLException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        } finally {
            if (connection != null) {
                //closing connection
                try {
                    connection.close();
                } catch (SQLException e) {
                    // TODO Auto-generated catch block
                    e.printStackTrace();
                }
            } // if condition
        }// finally
    }
}
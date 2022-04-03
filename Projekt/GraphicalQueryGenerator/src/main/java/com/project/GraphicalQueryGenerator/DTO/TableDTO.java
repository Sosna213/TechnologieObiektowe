package com.project.GraphicalQueryGenerator.DTO;

import lombok.Data;

import java.util.List;

@Data
public class TableDTO {
    String name;
    List<String> columns;
    List<String> primaryKeys;
    List<String> foreignKeys;
}

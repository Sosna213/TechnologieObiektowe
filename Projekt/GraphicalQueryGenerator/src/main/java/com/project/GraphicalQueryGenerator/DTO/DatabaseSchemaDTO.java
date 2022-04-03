package com.project.GraphicalQueryGenerator.DTO;

import lombok.Data;

import java.util.List;

@Data
public class DatabaseSchemaDTO {
    List<TableDTO> tableDTOS;
}

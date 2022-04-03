package com.project.GraphicalQueryGenerator.Controller;

import com.project.GraphicalQueryGenerator.DTO.DatabaseSchemaDTO;
import com.project.GraphicalQueryGenerator.Service.DatabaseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DatabaseController {

    private final DatabaseService databaseService;

    @GetMapping("database/schema")
    public ResponseEntity<DatabaseSchemaDTO> getDatabaseSchema(){
        DatabaseSchemaDTO databaseSchemaDTO = databaseService.getDatabaseSchema();
        return ResponseEntity.ok().body(databaseSchemaDTO);
    }
}

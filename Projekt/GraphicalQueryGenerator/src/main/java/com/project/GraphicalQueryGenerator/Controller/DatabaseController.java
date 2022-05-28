package com.project.GraphicalQueryGenerator.Controller;

import com.project.GraphicalQueryGenerator.DTO.DatabaseSchemaDTO;
import com.project.GraphicalQueryGenerator.Service.DatabaseService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DatabaseController {

    private final DatabaseService databaseService;

    @GetMapping("database/schema")
    public ResponseEntity<DatabaseSchemaDTO> getDatabaseSchema() {
        DatabaseSchemaDTO databaseSchemaDTO = databaseService.getDatabaseSchema();
        return ResponseEntity.ok().body(databaseSchemaDTO);
    }
    @GetMapping("database/result/{SQL}")
    public ResponseEntity<String> getResultFromQuery(@PathVariable String SQL) {
        JSONArray result = this.databaseService.getDataUsingSelect(SQL);
        return ResponseEntity.ok().body(result.toString());
    }
}

package com.project.GraphicalQueryGenerator.Controller;

import com.project.GraphicalQueryGenerator.DTO.DatabaseSchemaDTO;
import com.project.GraphicalQueryGenerator.Service.DatabaseService;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DatabaseController {

    private final DatabaseService databaseService;

    @GetMapping("database/schema")
    public ResponseEntity<DatabaseSchemaDTO> getDatabaseSchema(@RequestParam(value = "driverClass") String driverClass,
                                                               @RequestParam(value = "databaseURL") String databaseURL,
                                                               @RequestParam(value = "username") String username,
                                                               @RequestParam(value = "password") String password) {
        DatabaseSchemaDTO databaseSchemaDTO = databaseService.getDatabaseSchema(driverClass, databaseURL, username, password);
        return ResponseEntity.ok().body(databaseSchemaDTO);
    }

    @GetMapping("database/result")
    public ResponseEntity<String> getResultFromQuery(@RequestParam(value = "driverClass") String driverClass,
                                                     @RequestParam(value = "databaseURL") String databaseURL,
                                                     @RequestParam(value = "username") String username,
                                                     @RequestParam(value = "password") String password,
                                                     @RequestParam(value = "SQL") String SQL) {
        JSONArray result = this.databaseService.getDataUsingSelect(SQL, driverClass, databaseURL, username, password);
        return ResponseEntity.ok().body(result.toString());
    }
}

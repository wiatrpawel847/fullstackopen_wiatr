```mermaid
sequenceDiagram
    participant browser
    participant server

    Note over browser: User writes a note in the text field and clicks the Save button

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: ("status", "succes", "id",: "123" )
    deactivate server
```

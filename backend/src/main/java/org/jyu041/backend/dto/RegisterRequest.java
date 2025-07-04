// backend/src/main/java/org/jyu041/backend/dto/RegisterRequest.java
package org.jyu041.backend.dto;

public class RegisterRequest {
    private String email;
    private String password;

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}
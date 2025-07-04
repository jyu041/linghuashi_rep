// backend/src/main/java/org/jyu041/backend/dto/InitialSelectionRequest.java
package org.jyu041.backend.dto;

public class InitialSelectionRequest {
    private String displayName;
    private String profession;
    private String gender;

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public String getProfession() { return profession; }
    public void setProfession(String profession) { this.profession = profession; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }
}
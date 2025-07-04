// backend/src/test/java/org/jyu041/backend/utils/TestDataBuilder.java
package org.jyu041.backend.utils;

import org.jyu041.backend.entity.User;
import org.jyu041.backend.entity.Equipment;
import org.jyu041.backend.dto.*;

/**
 * Utility class for building test data objects
 */
public class TestDataBuilder {

    public static User createTestUser() {
        User user = new User();
        user.setId("test-user-123");
        user.setEmail("test@example.com");
        user.setPassword("encodedPassword");
        user.setDisplayName("TestUser");
        user.setProfession("Warrior");
        user.setGender("Male");
        user.setInitialSelectionComplete(true);
        user.setLevel(5);
        user.setBuns(100);
        user.setSilverCoins(1000);
        return user;
    }

    public static User createHighLevelUser() {
        User user = createTestUser();
        user.setLevel(50);
        user.setCultivationRealm("筑基中期");
        user.setCurrentXp(1000);
        user.setBuns(500);
        user.setSilverCoins(50000);
        user.setEliteBossCharges(3);
        return user;
    }

    public static Equipment createTestEquipment(String type, String tier, int level) {
        return new Equipment("Test " + type, type, tier, "#008000", level);
    }

    public static RegisterRequest createRegisterRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("newuser@example.com");
        request.setPassword("password123");
        return request;
    }

    public static LoginRequest createLoginRequest() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        return request;
    }

    public static InitialSelectionRequest createInitialSelectionRequest() {
        InitialSelectionRequest request = new InitialSelectionRequest();
        request.setDisplayName("TestWarrior");
        request.setProfession("Warrior");
        request.setGender("Male");
        return request;
    }

    public static FightEnemyRequest createFightEnemyRequest() {
        FightEnemyRequest request = new FightEnemyRequest();
        request.setEnemyType("Goblin");
        request.setPositionX(100.0);
        request.setPositionY(200.0);
        return request;
    }
}
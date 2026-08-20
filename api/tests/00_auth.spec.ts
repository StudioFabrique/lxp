import request from "supertest";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import app from "../src/app.ts";
import User from "../src/utils/interfaces/db/user.ts";

dotenv.config();

const prisma = new PrismaClient();

/**
 * Helper method to disconnect from MongoDB
 * Ensures proper cleanup of database connections
 */
const disconnect = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

const MONGO_TEST_URL = process.env.MONGO_TEST_URL;

/**
 * Authentication API Test Suite
 *
 * This test suite covers all authentication-related endpoints including:
 * - User login/logout
 * - Token refresh
 * - Authentication handshake
 * - Role verification
 *
 * Test Structure:
 * - beforeAll: Sets up database connection and obtains authentication tokens
 * - Each describe block: Tests a specific endpoint with various scenarios
 * - afterAll: Cleans up database connections
 */
describe("HTTP auth", () => {
  let authToken = {}; // Authentication token for authorized requests
  let refreshToken = {}; // Refresh token for token renewal

  /**
   * Test setup - runs before all tests
   * Establishes database connection and obtains authentication tokens
   * for use in subsequent tests
   */
  beforeAll(async () => {
    // Connect to MongoDB test database
    await mongoConnect();

    // Login with admin credentials to obtain authentication tokens
    const loginResponse = await request(app)
      .post("/v1/auth/login")
      .send({ email: "admin@studio.eco", password: "Abcdef@123456" });

    // Extract auth and refresh tokens from response cookies
    authToken = loginResponse.headers["set-cookie"][0];
    refreshToken = loginResponse.headers["set-cookie"][1];
  });

  /**
   * POST /auth/login endpoint tests
   * Tests various login scenarios including success and failure cases
   */
  describe("Test POST /auth/login", () => {
    /**
     * Test successful login with valid credentials
     * Should return 200 status code and set authentication cookies
     */
    test("It should respond with 200 success", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          password: "Abcdef@123456",
        })
        .expect(200);
    });

    /**
     * Test login failure when email is missing
     * Should return 401 unauthorized
     */
    test("It should respond with 401 unauthorized when email is missing", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          // email: "admin@studio.eco", // Intentionally omitted
          password: "Abcdef@123456",
        })
        .expect(401);
    });

    /**
     * Test login failure with malicious email input
     * Should return 401 unauthorized and not be vulnerable to injection
     */
    test("It should respond with 401 unauthorized for malicious email", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "<hacked>lol</hacked>",
          password: "Abcdef@123456",
        })
        .expect(401);
    });

    /**
     * Test login failure with invalid email domain
     * Should return 401 unauthorized
     */
    test("It should respond with 401 unauthorized for invalid email", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.ecor", // Invalid domain
          password: "Abcdef@123456",
        })
        .expect(401);
    });

    /**
     * Test login failure when password is missing
     * Should return 401 unauthorized
     */
    test("It should respond with 401 unauthorized when password is missing", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          // password: "Abcdef@123456", // Intentionally omitted
        })
        .expect(401);
    });

    /**
     * Test login failure with incorrect password
     * Should return 401 unauthorized
     */
    test("It should respond with 401 unauthorized for wrong password", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          password: "Abcdef@1234567", // Incorrect password
        })
        .expect(401);
    });

    /**
     * Test login failure with malicious password input
     * Should return 401 unauthorized and not be vulnerable to injection
     */
    test("It should respond with 401 unauthorized for malicious password", async () => {
      await request(app)
        .post("/v1/auth/login")
        .send({
          email: "admin@studio.eco",
          password: "<hacked>lol</hacked>",
        })
        .expect(401);
    });

    test("It should not reveal that an account exists but awaits activation", async () => {
      // Distinguer « compte en attente d'activation » de « compte inconnu »
      // permettait de tester une liste d'adresses pour savoir lesquelles sont
      // inscrites. Les deux cas répondent désormais à l'identique, et le lien
      // de renvoi d'activation est proposé après n'importe quel échec.
      // L'état du compte est posé ici plutôt que hérité des fixtures :
      // `01_user.spec.ts` réactive `formateur2` au passage, et l'ordre
      // d'exécution des fichiers dépend du cache de jest.
      await User.updateOne(
        { email: "formateur2@studio.eco" },
        { $set: { isActive: false, emailVerified: false } },
      );

      const inactif = await request(app).post("/v1/auth/login").send({
        email: "formateur2@studio.eco",
        password: "Abcdef@123456",
      });
      const inconnu = await request(app).post("/v1/auth/login").send({
        email: "jamais.inscrit@studio.eco",
        password: "Abcdef@123456",
      });

      expect(inactif.status).toBe(401);
      expect(inactif.body.code).toBeUndefined();
      expect(inactif.body).toEqual(inconnu.body);
      expect(inactif.status).toBe(inconnu.status);
    });
  });

  describe("Test POST /auth/resend-activation", () => {
    test("It should resend once and enforce the account cooldown", async () => {
      const email = "formateur2@studio.eco";
      // Même précaution : le renvoi n'est proposé qu'à un compte encore inactif.
      await User.updateOne(
        { email },
        {
          $set: { invitationSent: false, isActive: false, emailVerified: false },
          $unset: { invitationSentAt: 1 },
        },
      );

      const firstResponse = await request(app)
        .post("/v1/auth/resend-activation")
        .send({ email });
      const user = await User.findOne({ email });

      expect(firstResponse.status).toBe(200);
      expect(user?.invitationSent).toBe(true);
      expect(user?.invitationSentAt).toBeInstanceOf(Date);

      const secondResponse = await request(app)
        .post("/v1/auth/resend-activation")
        .send({ email });

      expect(secondResponse.status).toBe(429);
      expect(secondResponse.body.code).toBe("ACTIVATION_EMAIL_COOLDOWN");
      expect(secondResponse.body.retryAfterSeconds).toBeGreaterThan(0);
    });
  });

  /**
   * GET /auth/handshake endpoint tests
   * Tests authentication verification endpoint
   */
  describe("Test GET /auth/handshake", () => {
    /**
     * Test successful handshake with valid authentication token
     * Should return 200 status code confirming valid authentication
     */
    test("It should respond 200 success with valid auth token", async () => {
      await request(app)
        .get("/v1/auth/handshake")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    /**
     * Test handshake failure without authentication token
     * Should return 403 forbidden
     */
    test("It should respond 401 unauthorized without auth token", async () => {
      await request(app).get("/v1/auth/handshake").expect(401);
    });
  });

  /**
   * GET /auth/refresh endpoint tests
   * Tests token refresh functionality
   */
  describe("Test GET /auth/refresh", () => {
    /**
     * Test successful token refresh with valid refresh token
     * Should return 200 status code and new authentication tokens
     */
    test("It should respond 200 success with valid refresh token", async () => {
      await request(app)
        .get("/v1/auth/refresh")
        .set("Cookie", [`${refreshToken}`])
        .expect(200);
    });

    /**
     * Test token refresh failure without refresh token
     * Should return 403 forbidden
     */
    test("It should respond 401 unauthorized without refresh token", async () => {
      await request(app).get("/v1/auth/refresh").expect(401);
    });
  });

  /**
   * GET /auth/logout endpoint tests
   * Tests user logout functionality
   */
  describe("Test GET /auth/logout", () => {
    /**
     * Test successful logout
     * Should return 200 status code and clear authentication cookies
     * Note: Logout should work regardless of authentication state
     */
    test("It should respond 200 success", async () => {
      await request(app).get("/v1/auth/logout").expect(200);
    });
  });

  /**
   * GET /auth/roles endpoint tests
   * Tests user role retrieval functionality
   */
  describe("Test GET /auth/roles", () => {
    /**
     * Test successful role retrieval with valid authentication
     * Should return 200 status code and user roles
     */
    test("It should respond 200 success with valid auth token", async () => {
      await request(app)
        .get("/v1/auth/roles")
        .set("Cookie", [`${authToken}`])
        .expect(200);
    });

    /**
     * Test role retrieval failure without authentication
     * Should return 403 forbidden when no auth token is provided
     */
    test("It should respond 401 unauthorized without auth token", async () => {
      await request(app)
        .get("/v1/auth/roles")
        // .set("Cookie", [`${authToken}`]) // Intentionally commented out
        .expect(401);
    });
  });

  /**
   * Test cleanup - runs after all tests
   * Ensures proper cleanup of database connections to prevent memory leaks
   */
  afterAll(async () => {
    // Close MongoDB connection
    await disconnect();
  });
});

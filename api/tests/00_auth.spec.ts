import request from "supertest";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import mongoConnect from "../src/utils/services/db/mongo-connect.ts";
import app from "../src/app.ts";
import User from "../src/utils/interfaces/db/user.ts";
import Role from "../src/utils/interfaces/db/role.ts";
import BlackListedToken from "../src/utils/interfaces/db/blacklisted-token.ts";
import {
  createFirstAdmin,
  createRootAccount,
  promoteAdminToRoot,
} from "../src/models/auth/setup.ts";
import { env } from "../src/config/env.ts";
import { confirmEmailChange } from "../src/models/user/change-email.ts";
import { confirmRootEmail } from "../src/models/auth/confirm-root-email.ts";

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
      const response = await request(app)
        .get("/v1/auth/roles")
        .set("Cookie", [`${authToken}`])
        .expect(200);

      expect(
        response.body.some(({ role }: { role: string }) =>
          ["root", "admin"].includes(role),
        ),
      ).toBe(false);
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

  describe("Initialisation du compte root", () => {
    test("le premier root reste inactif jusqu'à la validation de son email", async () => {
      const privilegedRoles = await Role.find({ rank: { $lte: 1 } }).select(
        "_id",
      );
      const activeAdmins = await User.find({
        roles: { $in: privilegedRoles.map(({ _id }) => _id) },
        isActive: true,
      }).select("_id");
      const email = "root-init@test.fr";
      const token = jwt.sign({ purpose: "first-admin" }, env.REGISTER_SECRET, {
        expiresIn: "5m",
      });
      let rootUserId: string | undefined;
      let verificationToken: string | undefined;

      await User.updateMany(
        { _id: { $in: activeAdmins.map(({ _id }) => _id) } },
        { $set: { isActive: false } },
      );

      try {
        rootUserId = await createFirstAdmin({
          token,
          email,
          firstname: "Compte",
          lastname: "Root",
          password: "RootPassword@123",
        });

        const rootUser = await User.findById(rootUserId).populate("roles");
        expect(rootUser).toEqual(
          expect.objectContaining({
            email,
            emailVerified: false,
            isActive: false,
          }),
        );
        expect(rootUser?.roles).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ role: "root", rank: 0 }),
          ]),
        );

        verificationToken = jwt.sign(
          {
            purpose: "root-email-verification",
            userId: rootUserId,
            email,
          },
          env.REGISTER_SECRET,
          { expiresIn: "24h" },
        );
        await confirmRootEmail(verificationToken);

        expect(await User.findById(rootUserId)).toEqual(
          expect.objectContaining({
            emailVerified: true,
            isActive: true,
          }),
        );
        expect(
          await BlackListedToken.exists({ token: verificationToken }),
        ).not.toBeNull();
        await expect(confirmRootEmail(verificationToken)).rejects.toMatchObject({
          statusCode: 400,
          message: "Ce lien a déjà été utilisé.",
        });
      } finally {
        if (rootUserId) {
          await prisma.admin.deleteMany({ where: { idMdb: rootUserId } });
          await User.deleteOne({ _id: rootUserId });
        }
        await BlackListedToken.deleteOne({ token });
        if (verificationToken) {
          await BlackListedToken.deleteOne({ token: verificationToken });
        }
        await User.updateMany(
          { _id: { $in: activeAdmins.map(({ _id }) => _id) } },
          { $set: { isActive: true } },
        );
      }
    });

    test("un administrateur peut promouvoir son propre compte en root", async () => {
      const admin = await User.findOne({ email: "admin@studio.eco" });
      expect(admin).not.toBeNull();

      const initialRoles = [...admin!.roles];
      const token = jwt.sign({ purpose: "first-admin" }, env.REGISTER_SECRET, {
        expiresIn: "5m",
      });

      try {
        await promoteAdminToRoot(token, admin!._id.toString());

        const promotedAdmin = await User.findById(admin!._id).populate("roles");
        expect(promotedAdmin?.roles).toEqual([
          expect.objectContaining({ role: "root", rank: 0 }),
        ]);
        expect(await BlackListedToken.exists({ token })).not.toBeNull();
      } finally {
        await User.updateOne(
          { _id: admin!._id },
          { $set: { roles: initialRoles } },
        );
        await BlackListedToken.deleteOne({ token });
      }
    });

    test("une invitation liée à un email crée un nouveau compte root", async () => {
      const email = "nouveau-root@test.fr";
      const token = jwt.sign(
        { purpose: "root-account", email },
        env.REGISTER_SECRET,
        { expiresIn: "5m" },
      );
      let rootUserId: string | undefined;

      try {
        rootUserId = await createRootAccount({
          token,
          email,
          firstname: "Nouveau",
          lastname: "Root",
          password: "RootPassword@123",
        });

        const rootUser = await User.findById(rootUserId).populate("roles");
        expect(rootUser).toEqual(
          expect.objectContaining({
            email,
            emailVerified: true,
            isActive: true,
          }),
        );
        expect(rootUser?.roles).toEqual([
          expect.objectContaining({ role: "root", rank: 0 }),
        ]);
      } finally {
        if (rootUserId) {
          await prisma.admin.deleteMany({ where: { idMdb: rootUserId } });
          await User.deleteOne({ _id: rootUserId });
        }
        await BlackListedToken.deleteOne({ token });
      }
    });

    test("le changement d'email n'est appliqué qu'avec le lien de validation", async () => {
      const user = await User.findOne({ email: "admin@studio.eco" });
      expect(user).not.toBeNull();
      const originalEmail = user!.email;
      const email = "admin-valide@test.fr";
      const token = jwt.sign(
        {
          purpose: "email-change",
          userId: user!._id.toString(),
          email,
        },
        env.REGISTER_SECRET,
        { expiresIn: "5m" },
      );

      try {
        await User.updateOne(
          { _id: user!._id },
          { $set: { pendingEmail: email } },
        );
        expect((await User.findById(user!._id))?.email).toBe(originalEmail);

        await confirmEmailChange(token);

        const updated = await User.findById(user!._id);
        expect(updated?.email).toBe(email);
        expect(updated?.emailVerified).toBe(true);
        expect(updated?.pendingEmail).toBeUndefined();
      } finally {
        await User.updateOne(
          { _id: user!._id },
          {
            $set: { email: originalEmail, emailVerified: true },
            $unset: { pendingEmail: 1 },
          },
        );
        await BlackListedToken.deleteOne({ token });
      }
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

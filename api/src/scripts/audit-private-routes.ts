import fs from "fs";
import path from "path";
import ts from "typescript";

const routesRoot = path.join(__dirname, "..", "routes", "v1");
const methods = new Set(["get", "post", "put", "patch", "delete"]);
const publicAuthPaths = new Set([
  "/login",
  "/logout",
  "/refresh",
  "/backgrounds",
  "/setup-status",
  "/verify-activation-token",
  "/first-admin",
]);
const publicUserPaths = new Set([
  "PUT /reset-password",
  "POST /activate",
  "POST /check-invitation",
]);

function filesIn(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    return entry.isDirectory()
      ? filesIn(target)
      : entry.name.endsWith(".ts")
        ? [target]
        : [];
  });
}

const failures: string[] = [];
let routeCount = 0;

for (const file of filesIn(routesRoot)) {
  const sourceText = fs.readFileSync(file, "utf8");
  const source = ts.createSourceFile(
    file,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
  );

  const visit = (node: ts.Node) => {
    if (
      ts.isCallExpression(node) &&
      ts.isPropertyAccessExpression(node.expression) &&
      methods.has(node.expression.name.text)
    ) {
      routeCount += 1;
      const routePath =
        node.arguments[0] && ts.isStringLiteral(node.arguments[0])
          ? node.arguments[0].text
          : "";
      const callText = node.getText(source);
      const isAuthRoute = file.endsWith(
        path.join("auth", "auth.router.ts"),
      );
      const isPublic = isAuthRoute && publicAuthPaths.has(routePath);
      const isPublicUserLifecycle =
        file.endsWith(path.join("user", "user.router.ts")) &&
        publicUserPaths.has(
          `${node.expression.name.text.toUpperCase()} ${routePath}`,
        );
      const isAuthenticatedLifecycle =
        isAuthRoute && callText.includes("checkToken");
      const hasAbility = callText.includes("checkPermissions(");

      if (
        !isPublic &&
        !isPublicUserLifecycle &&
        !isAuthenticatedLifecycle &&
        !hasAbility
      ) {
        const position = source.getLineAndCharacterOfPosition(node.getStart());
        failures.push(
          `${path.relative(process.cwd(), file)}:${position.line + 1} ${node.expression.name.text.toUpperCase()} ${routePath}`,
        );
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
}

if (failures.length) {
  console.error("Private routes without an explicit ability rule:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`${routeCount} routes audited; no private route is unguarded.`);
}

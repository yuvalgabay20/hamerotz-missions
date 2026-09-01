import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("GitHub Pages workflow", () => {
  it("is discoverable from the Git root and resolves mission-site paths", () => {
    const repositoryRoot = execFileSync(
      "git",
      ["rev-parse", "--show-toplevel"],
      { encoding: "utf8" },
    ).trim();
    const workflowPath = join(
      repositoryRoot,
      ".github",
      "workflows",
      "pages.yml",
    );
    const nestedWorkflowPath = join(
      repositoryRoot,
      "mission-site",
      ".github",
      "workflows",
      "pages.yml",
    );

    expect(existsSync(workflowPath)).toBe(true);
    expect(existsSync(nestedWorkflowPath)).toBe(false);

    const workflow = readFileSync(workflowPath, "utf8");
    expect(workflow).toContain(
      "cache-dependency-path: mission-site/package-lock.json",
    );
    expect(workflow).toMatch(
      /defaults:\s+run:\s+working-directory: mission-site/,
    );
    expect(workflow).toContain("path: mission-site/dist/client");
  });
});

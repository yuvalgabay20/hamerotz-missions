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
    expect(workflow).toMatch(
      /- name: Setup Pages\s+id: pages\s+uses: actions\/configure-pages@v5/,
    );
    expect(workflow).toContain(
      "NEXT_PUBLIC_BASE_PATH: ${{ steps.pages.outputs.base_path }}",
    );
    expect(workflow).toContain(
      "NEXT_PUBLIC_SITE_URL: ${{ steps.pages.outputs.base_url }}",
    );
    expect(workflow).not.toContain("github.repository_owner");
    expect(workflow).not.toContain("github.event.repository.name");
  });
});

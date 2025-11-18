/**
 * @iqai/adk - IQAI Agent Development Kit
 *
 * This workspace package re-exports the published @iqai/adk npm package.
 * All agents in this monorepo depend on "workspace:*" which resolves to this package.
 *
 * The actual @iqai/adk implementation comes from npm as a peerDependency,
 * ensuring all agents use the same version throughout the workspace.
 */

// Re-export everything from the npm @iqai/adk package
export * from "@iqai/adk";

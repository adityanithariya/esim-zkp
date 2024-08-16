// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.
import anchor, { type Provider } from "@coral-xyz/anchor";

module.exports = async (provider: Provider) => {
	// Configure client to use the provider.
	anchor.setProvider(provider);

	// Add your deploy script here.
};

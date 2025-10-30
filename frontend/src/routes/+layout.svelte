<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { FolderKanban, Archive } from 'lucide-svelte';
</script>

<div class="app">
	<nav class="navbar">
		<div class="nav-container">
			<div class="nav-content">
				<a href="/" class="nav-brand">
					<FolderKanban size={24} />
					Project Manager
				</a>

				<div class="nav-links">
					<a href="/" class="btn btn-sm {$page.url.pathname === '/' ? 'btn-primary' : 'btn-outline'}">
						<FolderKanban size={16} />
						Projects
					</a>
					<a href="/archived" class="btn btn-sm {$page.url.pathname === '/archived' ? 'btn-primary' : 'btn-outline'}">
						<Archive size={16} />
						Archived
					</a>
				</div>
			</div>
		</div>
	</nav>

	<main class="main-content">
		<slot />
	</main>

	<footer class="footer">
		<p>Project Manager © 2025 | Cybersecurity Assessment Platform</p>
	</footer>
</div>

<style>
	.app {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.navbar {
		background-color: var(--surface);
		border-bottom: 1px solid var(--border);
		box-shadow: 0 1px 3px var(--shadow);
	}

	.nav-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 1rem 1.5rem;
	}

	.nav-content {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.nav-brand {
		text-decoration: none;
		color: var(--text);
		font-size: 1.25rem;
		font-weight: 700;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.nav-links {
		display: flex;
		gap: 0.5rem;
	}

	.main-content {
		flex: 1;
		max-width: 1200px;
		width: 100%;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.footer {
		background-color: var(--surface);
		border-top: 1px solid var(--border);
		padding: 1.5rem;
		text-align: center;
		color: var(--text-secondary);
		font-size: 0.875rem;
	}
</style>

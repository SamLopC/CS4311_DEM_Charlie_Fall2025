<script lang="ts">
	import { onMount } from 'svelte';
	import { RefreshCw } from 'lucide-svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import { projectApi } from '$lib/services/api';
	import type { Project } from '$lib/types';

	let projects: Project[] = [];
	let loading = true;
	let message: { type: 'success' | 'error'; text: string } | null = null;

	onMount(() => {
		loadProjects();
	});

	async function loadProjects() {
		try {
			loading = true;
			const data = await projectApi.getAll(true);
			projects = data.filter((p) => p.archived);
		} catch (error: any) {
			showMessage('error', 'Failed to load archived projects');
		} finally {
			loading = false;
		}
	}

	function showMessage(type: 'success' | 'error', text: string) {
		message = { type, text };
		setTimeout(() => {
			message = null;
		}, 5000);
	}

	async function handleRestore(event: CustomEvent<Project>) {
		const project = event.detail;
		if (!confirm(`Restore "${project.name}" to active projects?`)) {
			return;
		}

		try {
			await projectApi.restore(project.id);
			showMessage('success', 'Project restored successfully');
			loadProjects();
		} catch (error: any) {
			showMessage('error', 'Failed to restore project');
		}
	}

	async function handleDelete(event: CustomEvent<Project>) {
		const project = event.detail;
		if (
			!confirm(
				`Are you sure you want to permanently delete "${project.name}"? This cannot be undone.`
			)
		) {
			return;
		}

		try {
			await projectApi.delete(project.id);
			showMessage('success', 'Project deleted successfully');
			loadProjects();
		} catch (error: any) {
			showMessage('error', 'Failed to delete project');
		}
	}
</script>

<svelte:head>
	<title>Archived Projects - Project Manager</title>
</svelte:head>

<div>
	<div
		style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;"
	>
		<div>
			<h1>Archived Projects</h1>
			<p class="text-secondary">View and manage archived projects</p>
		</div>
		<button class="btn btn-outline" on:click={loadProjects} disabled={loading}>
			<RefreshCw size={16} class={loading ? 'loading' : ''} />
			Refresh
		</button>
	</div>

	{#if message}
		<div class="alert alert-{message.type}">
			{message.text}
		</div>
	{/if}

	{#if loading}
		<div style="text-align: center; padding: 3rem;">
			<div class="loading" style="width: 2rem; height: 2rem; margin: 0 auto;" />
			<p class="text-secondary" style="margin-top: 1rem;">Loading archived projects...</p>
		</div>
	{:else}
		<ProjectList
			{projects}
			showArchived={true}
			on:restore={handleRestore}
			on:delete={handleDelete}
			on:edit={() => {}}
			on:archive={() => {}}
		/>
	{/if}
</div>

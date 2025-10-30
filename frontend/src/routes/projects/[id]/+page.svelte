<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Server, Box, Download } from 'lucide-svelte';
	import { projectApi } from '$lib/services/api';
	import type { Project, Host } from '$lib/types';

	let project: Project | null = null;
	let hosts: Host[] = [];
	let loading = true;
	let message: { type: 'success' | 'error'; text: string } | null = null;

	$: projectId = $page.params.id;

	onMount(() => {
		loadProject();
		loadHosts();
	});

	async function loadProject() {
		try {
			loading = true;
			project = await projectApi.getById(projectId);
		} catch (error: any) {
			showMessage('error', 'Failed to load project');
		} finally {
			loading = false;
		}
	}

	async function loadHosts() {
		try {
			hosts = await projectApi.getHosts(projectId);
		} catch (error: any) {
			console.error('Failed to load hosts:', error);
		}
	}

	function showMessage(type: 'success' | 'error', text: string) {
		message = { type, text };
		setTimeout(() => {
			message = null;
		}, 5000);
	}

	async function handleExport() {
		try {
			const jsonData = await projectApi.export(projectId);
			const blob = new Blob([jsonData], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${project?.name || 'project'}_export.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			showMessage('success', 'Project exported successfully');
		} catch (error: any) {
			showMessage('error', 'Failed to export project');
		}
	}

	function goBack() {
		goto('/');
	}
</script>

<svelte:head>
	<title>{project?.name || 'Project Details'} - Project Manager</title>
</svelte:head>

{#if loading}
	<div style="text-align: center; padding: 3rem;">
		<div class="loading" style="width: 2rem; height: 2rem; margin: 0 auto;" />
		<p class="text-secondary" style="margin-top: 1rem;">Loading project...</p>
	</div>
{:else if !project}
	<div class="empty-state">
		<h3>Project Not Found</h3>
		<button class="btn btn-primary" on:click={goBack} style="margin-top: 1rem;">
			<ArrowLeft size={16} />
			Back to Projects
		</button>
	</div>
{:else}
	<div>
		<button class="btn btn-outline" on:click={goBack} style="margin-bottom: 1rem;">
			<ArrowLeft size={16} />
			Back to Projects
		</button>

		{#if message}
			<div class="alert alert-{message.type}">
				{message.text}
			</div>
		{/if}

		<div class="card">
			<div
				style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1.5rem;"
			>
				<div>
					<h1>{project.name}</h1>
					<div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
						<span class="badge badge-info">{project.analystInitials}</span>
						<span class="badge {project.eventType === 'CVI' ? 'badge-success' : 'badge-warning'}">
							{project.eventType}
						</span>
						{#if project.archived}
							<span class="badge badge-warning">ARCHIVED</span>
						{/if}
					</div>
				</div>
				<button class="btn btn-outline" on:click={handleExport}>
					<Download size={16} />
					Export
				</button>
			</div>

			<div class="grid grid-cols-2">
				<div>
					<p class="text-sm text-secondary">Start Date</p>
					<p><strong>{new Date(project.startDate).toLocaleDateString()}</strong></p>
				</div>
				<div>
					<p class="text-sm text-secondary">End Date</p>
					<p><strong>{new Date(project.endDate).toLocaleDateString()}</strong></p>
				</div>
			</div>
		</div>

		<div class="card">
			<div class="card-header">
				<div style="display: flex; justify-content: space-between; align-items: center;">
					<h2>
						<Server size={20} style="display: inline; vertical-align: middle; margin-right: 0.5rem;" />
						Hosts ({hosts.length})
					</h2>
					<button class="btn btn-primary btn-sm">
						<!-- <Plus size={16} /> -->
						Add Host
					</button>
				</div>
			</div>

			{#if hosts.length === 0}
				<div class="empty-state">
					<p class="text-secondary">No hosts added yet</p>
				</div>
			{:else}
				<table class="table">
					<thead>
						<tr>
							<th>IP Address</th>
							<th>Port</th>
							<th>Open Ports</th>
							<th>Containers</th>
						</tr>
					</thead>
					<tbody>
						{#each hosts as host}
							<tr>
								<td><code>{host.ip}</code></td>
								<td>{host.port || '-'}</td>
								<td>
									{host.openPorts && host.openPorts.length > 0
										? host.openPorts.join(', ')
										: 'None'}
								</td>
								<td>
									<span class="badge badge-info">
										<Box
											size={12}
											style="display: inline; vertical-align: middle; margin-right: 0.25rem;"
										/>
										{host.containers?.length || 0}
									</span>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		</div>
	</div>
{/if}

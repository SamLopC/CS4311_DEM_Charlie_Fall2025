<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { Edit, Trash2, Archive, ArchiveRestore, FolderOpen } from 'lucide-svelte';
	import type { Project } from '$lib/types';

	export let projects: Project[] = [];
	export let showArchived = false;

	const dispatch = createEventDispatcher();

	function handleEdit(project: Project) {
		dispatch('edit', project);
	}

	function handleDelete(project: Project) {
		dispatch('delete', project);
	}

	function handleArchive(project: Project) {
		dispatch('archive', project);
	}

	function handleRestore(project: Project) {
		dispatch('restore', project);
	}

	function viewProject(id: string) {
		goto(`/projects/${id}`);
	}
</script>

{#if projects.length === 0}
	<div class="empty-state">
		<div class="empty-state-icon">
			<Archive size={64} />
		</div>
		<h3>No {showArchived ? 'Archived ' : ''}Projects Found</h3>
		<p class="text-secondary">
			{showArchived
				? 'No archived projects available'
				: 'Create your first project to get started'}
		</p>
	</div>
{:else}
	<div class="table-container">
		<table class="table">
			<thead>
				<tr>
					<th>Project Name</th>
					<th>Analyst</th>
					<th>Event Type</th>
					<th>Start Date</th>
					<th>End Date</th>
					<th>Hosts</th>
					<th class="text-right">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#each projects as project (project.id)}
					<tr>
						<td>
							<strong>{project.name}</strong>
						</td>
						<td>
							<span class="badge badge-info">{project.analystInitials}</span>
						</td>
						<td>
							<span class="badge {project.eventType === 'CVI' ? 'badge-success' : 'badge-warning'}">
								{project.eventType}
							</span>
						</td>
						<td class="text-sm text-secondary">
							{new Date(project.startDate).toLocaleDateString()}
						</td>
						<td class="text-sm text-secondary">
							{new Date(project.endDate).toLocaleDateString()}
						</td>
						<td class="text-sm">
							{project.hostCount || 0} hosts
						</td>
						<td>
							<div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
								<button
									class="btn btn-outline btn-sm"
									on:click={() => viewProject(project.id)}
									title="View Details"
								>
									<FolderOpen size={16} />
								</button>

								{#if !showArchived}
									<button
										class="btn btn-outline btn-sm"
										on:click={() => handleEdit(project)}
										title="Edit"
									>
										<Edit size={16} />
									</button>
									<button
										class="btn btn-outline btn-sm"
										on:click={() => handleArchive(project)}
										title="Archive"
									>
										<Archive size={16} />
									</button>
								{/if}

								{#if showArchived}
									<button
										class="btn btn-success btn-sm"
										on:click={() => handleRestore(project)}
										title="Restore"
									>
										<ArchiveRestore size={16} />
									</button>
								{/if}

								<button
									class="btn btn-danger btn-sm"
									on:click={() => handleDelete(project)}
									title="Delete"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/if}

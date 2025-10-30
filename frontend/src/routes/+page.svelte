<script lang="ts">
	import { onMount } from 'svelte';
	import { Plus, RefreshCw } from 'lucide-svelte';
	import ProjectList from '$lib/components/ProjectList.svelte';
	import ProjectForm from '$lib/components/ProjectForm.svelte';
	import { projectApi } from '$lib/services/api';
	import type { Project, ProjectCreate } from '$lib/types';

	let projects: Project[] = [];
	let loading = true;
	let showForm = false;
	let editingProject: Project | null = null;
	let message: { type: 'success' | 'error'; text: string } | null = null;

	onMount(() => {
		loadProjects();
	});

	async function loadProjects() {
		try {
			loading = true;
			projects = await projectApi.getAll(false);
		} catch (error: any) {
			showMessage('error', 'Failed to load projects');
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

	async function handleCreate(event: CustomEvent<ProjectCreate>) {
		try {
			await projectApi.create(event.detail);
			showMessage('success', 'Project created successfully');
			showForm = false;
			loadProjects();
		} catch (error: any) {
			showMessage('error', error.response?.data?.detail || 'Failed to create project');
		}
	}

	function handleEdit(event: CustomEvent<Project>) {
		editingProject = event.detail;
		showForm = true;
	}

	async function handleUpdate(event: CustomEvent<ProjectCreate>) {
		if (!editingProject) return;

		try {
			await projectApi.update(editingProject.id, event.detail);
			showMessage('success', 'Project updated successfully');
			showForm = false;
			editingProject = null;
			loadProjects();
		} catch (error: any) {
			showMessage('error', error.response?.data?.detail || 'Failed to update project');
		}
	}

	async function handleDelete(event: CustomEvent<Project>) {
		const project = event.detail;
		if (!confirm(`Are you sure you want to delete "${project.name}"? This cannot be undone.`)) {
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

	async function handleArchive(event: CustomEvent<Project>) {
		const project = event.detail;
		if (!confirm(`Archive "${project.name}"?`)) {
			return;
		}

		try {
			await projectApi.archive(project.id);
			showMessage('success', 'Project archived successfully');
			loadProjects();
		} catch (error: any) {
			showMessage('error', 'Failed to archive project');
		}
	}

	function handleCloseForm() {
		showForm = false;
		editingProject = null;
	}

	function openCreateForm() {
		editingProject = null;
		showForm = true;
	}
</script>

<svelte:head>
	<title>Projects - Project Manager</title>
</svelte:head>

<div>
	<div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
		<div>
			<h1>Active Projects</h1>
			<p class="text-secondary">Manage your cybersecurity assessment projects</p>
		</div>
		<div style="display: flex; gap: 0.75rem;">
			<button class="btn btn-outline" on:click={loadProjects} disabled={loading}>
				<RefreshCw size={16} class={loading ? 'loading' : ''} />
				Refresh
			</button>
			<button class="btn btn-primary" on:click={openCreateForm}>
				<Plus size={16} />
				New Project
			</button>
		</div>
	</div>

	{#if message}
		<div class="alert alert-{message.type}">
			{message.text}
		</div>
	{/if}

	{#if loading}
		<div style="text-align: center; padding: 3rem;">
			<div class="loading" style="width: 2rem; height: 2rem; margin: 0 auto;" />
			<p class="text-secondary" style="margin-top: 1rem;">Loading projects...</p>
		</div>
	{:else}
		<ProjectList
			{projects}
			on:edit={handleEdit}
			on:delete={handleDelete}
			on:archive={handleArchive}
		/>
	{/if}

	{#if showForm}
		<ProjectForm
			initialData={editingProject
				? {
						name: editingProject.name,
						analystInitials: editingProject.analystInitials,
						startDate: editingProject.startDate,
						endDate: editingProject.endDate,
						eventType: editingProject.eventType
				  }
				: null}
			isEdit={!!editingProject}
			on:submit={editingProject ? handleUpdate : handleCreate}
			on:cancel={handleCloseForm}
		/>
	{/if}
</div>

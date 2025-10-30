<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X } from 'lucide-svelte';
	import type { ProjectCreate } from '$lib/types';

	export let initialData: ProjectCreate | null = null;
	export let isEdit = false;

	const dispatch = createEventDispatcher();

	let formData: ProjectCreate = initialData || {
		name: '',
		analystInitials: '',
		startDate: new Date().toISOString().split('T')[0],
		endDate: new Date().toISOString().split('T')[0],
		eventType: 'CVI'
	};

	let loading = false;
	let error = '';

	function handleSubmit() {
		error = '';

		if (!formData.name.trim()) {
			error = 'Project name is required';
			return;
		}
		if (!formData.analystInitials.trim()) {
			error = 'Analyst initials are required';
			return;
		}
		if (new Date(formData.endDate) < new Date(formData.startDate)) {
			error = 'End date must be after start date';
			return;
		}

		dispatch('submit', formData);
	}

	function handleCancel() {
		dispatch('cancel');
	}

	function handleOverlayClick(e: MouseEvent) {
		if (e.target === e.currentTarget) {
			handleCancel();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			handleCancel();
		}
	}
</script>

<svelte:window on:keydown={handleKeyDown} />

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-overlay" on:click={handleOverlayClick} role="dialog" aria-modal="true">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="modal" on:click|stopPropagation>
		<div class="modal-header">
			<h2>{isEdit ? 'Edit Project' : 'Create New Project'}</h2>
			<button class="btn btn-outline btn-sm" on:click={handleCancel} style="padding: 0.25rem;">
				<X size={20} />
			</button>
		</div>

		<form on:submit|preventDefault={handleSubmit}>
			<div class="modal-body">
				{#if error}
					<div class="alert alert-error">
						{error}
					</div>
				{/if}

				<div class="form-group">
					<label class="form-label" for="name">Project Name *</label>
					<input
						type="text"
						id="name"
						class="form-control"
						bind:value={formData.name}
						required
						placeholder="Enter project name"
					/>
				</div>

				<div class="form-group">
					<label class="form-label" for="initials">Analyst Initials *</label>
					<input
						type="text"
						id="initials"
						class="form-control"
						bind:value={formData.analystInitials}
						required
						maxlength="10"
						placeholder="e.g., JD"
					/>
				</div>

				<div class="grid grid-cols-2">
					<div class="form-group">
						<label class="form-label" for="startDate">Start Date *</label>
						<input
							type="date"
							id="startDate"
							class="form-control"
							bind:value={formData.startDate}
							required
						/>
					</div>

					<div class="form-group">
						<label class="form-label" for="endDate">End Date *</label>
						<input
							type="date"
							id="endDate"
							class="form-control"
							bind:value={formData.endDate}
							required
						/>
					</div>
				</div>

				<div class="form-group">
					<label class="form-label" for="eventType">Event Type *</label>
					<select id="eventType" class="form-control" bind:value={formData.eventType} required>
						<option value="CVI">CVI - Cyber Vulnerability Investigation</option>
						<option value="CVPA">CVPA - Cyber Vulnerability Penetration Assessment</option>
					</select>
				</div>
			</div>

			<div class="modal-footer">
				<button type="button" class="btn btn-outline" on:click={handleCancel} disabled={loading}>
					Cancel
				</button>
				<button type="submit" class="btn btn-primary" disabled={loading}>
					{#if loading}
						<span class="loading" />
						Saving...
					{:else}
						{isEdit ? 'Update Project' : 'Create Project'}
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
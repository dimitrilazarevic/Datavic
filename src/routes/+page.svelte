<script lang="ts">
	import type { Task } from '../../electron/lib/types';

	let tasks = $state<Task[]>([]);
	let newTitle = $state('');
	let newPriority = $state(1);

	async function loadTasks() {
		const api = window.electronAPI;
		if (!api) return;
		tasks = await api.db.getTasks();
	}

	async function addTask() {
		const api = window.electronAPI;
		if (!api || !newTitle.trim()) return;
		await api.db.addTask({ title: newTitle.trim(), priority: newPriority });
		newTitle = '';
		newPriority = 1;
		await loadTasks();
	}

	async function deleteTask(id: string) {
		const api = window.electronAPI;
		if (!api) return;
		await api.db.deleteTask(id);
		await loadTasks();
	}

	$effect(() => {
		loadTasks();
	});
</script>

<h1>DB Test - Tasks</h1>

<form onsubmit={e => { e.preventDefault(); addTask(); }}>
	<input bind:value={newTitle} placeholder="Titre de la tâche" />
	<input bind:value={newPriority} type="number" min="1" max="5" />
	<button type="submit">Ajouter</button>
</form>

{#if tasks.length === 0}
	<p>Aucune tâche.</p>
{:else}
	<ul>
		{#each tasks as t (t.id)}
			<li>
				<strong>{t.title}</strong> (priorité: {t.priority})
				<button onclick={() => deleteTask(t.id)}>Supprimer</button>
			</li>
		{/each}
	</ul>
{/if}

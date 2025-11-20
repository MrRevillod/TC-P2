<script lang="ts">
	import type { Metrics } from "../lib/grammar"

	interface Props {
		metrics: Metrics | null
		exportJSON: () => void
	}

	let { metrics, exportJSON }: Props = $props()
</script>

<article class="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold">
		Métricas del Proceso
	</h2>
	<div class="font-body space-y-2 text-sm">
		<p><strong>Total de Casos:</strong> {metrics?.totalGenerated ?? 0}</p>
		<p>
			<strong>Válidos:</strong>
			{metrics
				? `${metrics.validCount} (${metrics.validPercentage.toFixed(1)}%)`
				: "0 (0.0%)"}
		</p>
		<p>
			<strong>Inválidos:</strong>
			{metrics
				? `${metrics.invalidCount} (${metrics.invalidPercentage.toFixed(1)}%)`
				: "0 (0.0%)"}
		</p>
		<p>
			<strong>Extremos:</strong>
			{metrics
				? `${metrics.extremeCount} (${metrics.extremePercentage.toFixed(1)}%)`
				: "0 (0.0%)"}
		</p>
		<p>
			<strong>Longitud Promedio:</strong>
			{metrics?.avgLength.toFixed(1) ?? "0.0"}
		</p>
		<p><strong>Profundidad Máxima:</strong> {metrics?.maxDepth ?? 0}</p>
		<p><strong>Tiempo de Ejecución:</strong> {metrics?.avgExecutionTime ?? 0}ms</p>
	</div>
	<div class="mt-4">
		<h3 class="mb-2 font-bold">Conteo de Operadores</h3>
		<ul class="list-disc pl-5 text-sm">
			{#if metrics}
				{#each Object.entries(metrics.operatorCounts) as [op, count]}
					<li>{op}: {count}</li>
				{/each}
			{:else}
				<li class="text-gray-500">No hay datos disponibles</li>
			{/if}
		</ul>
	</div>
	<div class="mt-4">
		<button
			onclick={exportJSON}
			disabled={!metrics}
			class="w-full rounded-md border border-black bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-gray-800"
		>
			Exportar JSON
		</button>
	</div>
</article>

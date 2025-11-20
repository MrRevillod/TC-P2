<script lang="ts">
	import type { TestCase } from "../lib/grammar"

	interface Props {
		allCases: TestCase[]
	}

	let { allCases }: Props = $props()
</script>

<article class="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold">
		Casos Generados
	</h2>
	<div class="font-body max-h-96 space-y-2 overflow-y-auto text-sm">
		{#if allCases.length > 0}
			{#each allCases as testCase}
				<div class="rounded-md border border-gray-300 bg-gray-50 p-3">
					<div class="mb-1 flex justify-between">
						<span class="font-bold">Caso {testCase.id}</span>
						<span class="font-bold uppercase">{testCase.type}</span>
					</div>
					<p class="rounded-md border border-gray-300 bg-white p-2 font-mono">
						{testCase.expression}
					</p>
					{#if testCase.mutation}
						<p class="text-xs text-gray-700">Mutación: {testCase.mutation}</p>
					{/if}
				</div>
			{/each}
		{:else}
			<div class="rounded-md border border-gray-300 bg-gray-50 p-6 text-center">
				<p class="text-gray-500">No hay casos generados aún</p>
				<p class="mt-2 text-sm text-gray-400">
					Configure los parámetros y haga clic en "Generar Casos"
				</p>
			</div>
		{/if}
	</div>
</article>

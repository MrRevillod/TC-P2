<script lang="ts">
	import type { Grammar } from "../lib/grammar"

	interface Props {
		numValid: number
		numInvalid: number
		numExtreme: number
		maxDepth: number
		maxLength: number
		generateCases: () => void
		isGenerating: boolean
		grammar: Grammar | null
	}

	let {
		numValid,
		numInvalid,
		numExtreme,
		maxDepth,
		maxLength,
		generateCases,
		isGenerating,
		grammar,
	}: Props = $props()
</script>

<div class="grid w-full grid-cols-6 gap-4">
	<div class="flex flex-col">
		<label for="num-valid" class="mb-2 text-base font-bold text-gray-700">
			Casos Válidos
		</label>
		<input
			id="num-valid"
			type="number"
			bind:value={numValid}
			min="1"
			class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
		/>
	</div>

	<div class="flex flex-col">
		<label for="num-invalid" class="mb-2 text-base font-bold text-gray-700">
			Casos Inválidos
		</label>
		<input
			id="num-invalid"
			type="number"
			bind:value={numInvalid}
			min="0"
			class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
		/>
	</div>

	<div class="flex flex-col">
		<label for="num-extreme" class="mb-2 text-base font-bold text-gray-700">
			Casos Extremos
		</label>
		<input
			id="num-extreme"
			type="number"
			bind:value={numExtreme}
			min="0"
			class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
		/>
	</div>

	<div class="flex flex-col">
		<label for="max-depth" class="mb-2 text-base font-bold text-gray-700">
			Profundidad Máxima
		</label>
		<input
			id="max-depth"
			type="number"
			bind:value={maxDepth}
			min="1"
			class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
		/>
	</div>

	<div class="flex flex-col">
		<label for="max-length" class="mb-2 text-base font-bold text-gray-700">
			Longitud Máxima
		</label>
		<input
			id="max-length"
			type="number"
			bind:value={maxLength}
			min="1"
			class="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
		/>
	</div>

	<div class="flex flex-col">
		<div class="mb-2 h-5"></div>
		<button
			onclick={generateCases}
			disabled={isGenerating || !grammar}
			class="w-full rounded-md border border-black bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-gray-800 disabled:bg-gray-600 disabled:text-gray-300"
		>
			{isGenerating ? "Generando..." : "Generar Casos"}
		</button>
	</div>
</div>

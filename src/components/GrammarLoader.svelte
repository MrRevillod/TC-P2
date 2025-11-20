<script lang="ts">
	interface Props {
		grammarText: string
		handleFileUpload: (event: Event) => void
		onGrammarChange: (text: string) => void
	}

	let { grammarText, handleFileUpload, onGrammarChange }: Props = $props()

	let fileInput: HTMLInputElement

	function handleButtonClick() {
		fileInput?.click()
	}
</script>

<article class="rounded-md border border-gray-200 bg-white p-6 shadow-sm">
	<h2 class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold">
		Cargar Gramática
	</h2>
	<div class="space-y-4">
		<div>
			<label for="grammar-text" class="mb-2 block text-sm font-bold"
				>Gramática (editable)</label
			>
			<textarea
				id="grammar-text"
				bind:value={grammarText}
				oninput={e => onGrammarChange((e.target as HTMLTextAreaElement).value)}
				class="field-sizing-content h-32 w-full resize-none rounded-md border border-gray-400 bg-gray-50 p-3 font-mono text-sm"
				placeholder="E -> E + T | E - T | T&#10;T -> T * F | T / F | T % F | F&#10;F -> ( E ) | num&#10;num -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9"
			></textarea>
		</div>

		<div class="flex w-full gap-3">
			<input
				bind:this={fileInput}
				type="file"
				accept=".txt"
				onchange={handleFileUpload}
				class="hidden"
			/>
			<button
				onclick={handleButtonClick}
				class="w-full rounded-md border border-black bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-gray-800"
			>
				Seleccionar Archivo
			</button>
		</div>
	</div>
</article>

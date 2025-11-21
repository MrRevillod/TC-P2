<script lang="ts">
	interface Props {
		onNavigateToManual: () => void
	}

	let { onNavigateToManual }: Props = $props()
</script>

<header class="mb-8 border-b-2 border-black pb-4">
	<div class="mb-2 flex items-center justify-between">
		<h1 class="font-headline text-5xl font-bold text-black">
			Generador Automático de Casos de Prueba
		</h1>
		<button
			onclick={onNavigateToManual}
			class="rounded-md border border-black bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-gray-800"
		>
			Ir al Manual de Usuario
		</button>
	</div>
	<p class="font-body mt-4 text-sm text-gray-500">
		Proyecto II - Luciano Revillod, Carlos Riquelme y Benjamin Espinoza
	</p>
</header>

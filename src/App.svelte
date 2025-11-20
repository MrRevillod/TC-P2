<script lang="ts">
	import { onMount } from "svelte"
	import type { Grammar, TestCase, Metrics } from "./lib/grammar"
	import {
		parseGrammar,
		generateValid,
		generateInvalid,
		generateExtreme,
		calculateMetrics,
		exportToJSON,
	} from "./lib/grammar"
	import Header from "./components/Header.svelte"
	import GrammarLoader from "./components/GrammarLoader.svelte"
	import ConfigPanel from "./components/ConfigPanel.svelte"
	import MetricsDisplay from "./components/MetricsDisplay.svelte"
	import CasesDisplay from "./components/CasesDisplay.svelte"
	import Manual from "./components/Manual.svelte"

	let grammarText = $state("")
	let grammar = $state<Grammar | null>(null)
	let validCases = $state<TestCase[]>([])
	let invalidCases = $state<TestCase[]>([])
	let extremeCases = $state<TestCase[]>([])
	let allCases = $state<TestCase[]>([])
	let metrics = $state<Metrics | null>(null)

	let numValid = $state(10)
	let numInvalid = $state(5)
	let numExtreme = $state(3)
	let maxDepth = $state(5)
	let maxLength = $state(50)

	let isGenerating = $state(false)

	let currentPage = $state<"home" | "manual">("home")

	function handleFileUpload(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0]
		if (file) {
			const reader = new FileReader()
			reader.onload = e => {
				grammarText = e.target?.result as string
				try {
					grammar = parseGrammar(grammarText)
				} catch (error) {
					alert("Error parsing grammar: " + (error as Error).message)
				}
			}
			reader.readAsText(file)
		}
	}

	async function generateCases() {
		if (!grammar) {
			alert("Please load a grammar first")
			return
		}

		isGenerating = true
		const startTime = Date.now()

		validCases = generateValid(grammar, numValid, maxDepth)
		invalidCases = generateInvalid(validCases, numInvalid)
		extremeCases = generateExtreme(grammar, numExtreme, maxDepth, maxLength)

		allCases = [...validCases, ...invalidCases, ...extremeCases]
		metrics = calculateMetrics(allCases)
		metrics.avgExecutionTime = Date.now() - startTime

		isGenerating = false
	}

	function handleGrammarChange(text: string) {
		grammarText = text
		try {
			grammar = parseGrammar(text)
		} catch {}
	}

	function exportJSON() {
		if (!metrics) return
		const data = exportToJSON(allCases, metrics)
		const blob = new Blob([data], { type: "application/json" })
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = "test_cases.json"
		a.click()
		URL.revokeObjectURL(url)
	}

	function navigateTo(page: "home" | "manual") {
		currentPage = page
	}
	onMount(() => {
		window.addEventListener("navigate", (event: any) => {
			navigateTo(event.detail)
		})

		grammarText = `E -> E + T | E - T | T
T -> T * F | T / F | T % F | F
F -> ( E ) | num
num -> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9`
		grammar = parseGrammar(grammarText)
	})
</script>

<main class="font-body min-h-screen bg-white p-6 text-black">
	<div class="mx-auto max-w-7xl">
		{#if currentPage === "home"}
			<Header onNavigateToManual={() => navigateTo("manual")} />

			<div class="mt-20">
				<ConfigPanel
					{numValid}
					{numInvalid}
					{numExtreme}
					{maxDepth}
					{maxLength}
					{generateCases}
					{isGenerating}
					{grammar}
				/>
			</div>

			<div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
				<div class="h-[500px] overflow-hidden">
					<GrammarLoader
						{grammarText}
						{handleFileUpload}
						onGrammarChange={handleGrammarChange}
					/>
				</div>

				<div class="h-[500px] overflow-hidden">
					<MetricsDisplay {metrics} {exportJSON} />
				</div>

				<div class="h-[500px] overflow-hidden">
					<CasesDisplay {allCases} />
				</div>
			</div>
		{:else if currentPage === "manual"}
			<Manual />
		{/if}
	</div>
</main>

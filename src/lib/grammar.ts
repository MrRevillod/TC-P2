export interface Production {
	lhs: string
	rhs: string[]
}

export interface Grammar {
	start: string
	productions: Map<string, string[][]>
	terminals: Set<string>
	nonTerminals: Set<string>
}

export interface TestCase {
	id: number
	type: "valid" | "invalid" | "extreme"
	expression: string
	derivation?: string[]
	mutation?: string
}

export interface Metrics {
	totalGenerated: number
	validCount: number
	invalidCount: number
	extremeCount: number
	validPercentage: number
	invalidPercentage: number
	extremePercentage: number
	avgLength: number
	maxDepth: number
	operatorCounts: Record<string, number>
	mutationLevels: Record<string, number>
	avgExecutionTime: number
}

export function parseGrammar(text: string): Grammar {
	const lines = text
		.split("\n")
		.map(l => l.trim())
		.filter(l => l && !l.startsWith("#"))
	const productions = new Map<string, string[][]>()
	const terminals = new Set<string>()
	const nonTerminals = new Set<string>()

	let start = ""

	for (const line of lines) {
		const [lhs, rhs] = line.split("->").map(s => s.trim())
		if (!lhs || !rhs) continue

		if (!start) start = lhs
		nonTerminals.add(lhs)

		const alternatives = rhs.split("|").map(alt => alt.trim().split(/\s+/))
		productions.set(lhs, alternatives)

		for (const alt of alternatives) {
			for (const symbol of alt) {
				if (!productions.has(symbol) && symbol !== "ε") {
					terminals.add(symbol)
				}
			}
		}
	}

	return { start, productions, terminals, nonTerminals }
}

export function generateValid(
	grammar: Grammar,
	count: number,
	maxDepth: number
): TestCase[] {
	const cases: TestCase[] = []
	const startTime = Date.now()

	for (let i = 0; i < count; i++) {
		const { expression, derivation } = derive(grammar, grammar.start, maxDepth)
		cases.push({
			id: i + 1,
			type: "valid",
			expression,
			derivation,
		})
	}

	const endTime = Date.now()
	console.log(`Valid generation time: ${endTime - startTime}ms`)

	return cases
}

function derive(
	grammar: Grammar,
	symbol: string,
	maxDepth: number,
	depth = 0
): { expression: string; derivation: string[] } {
	if (depth > maxDepth) return { expression: "", derivation: [] }

	if (grammar.terminals.has(symbol)) {
		return { expression: symbol, derivation: [symbol] }
	}

	const prods = grammar.productions.get(symbol)
	if (!prods) return { expression: "", derivation: [] }

	const chosen = prods[Math.floor(Math.random() * prods.length)]
	let expression = ""
	const derivation: string[] = [symbol + " -> " + chosen.join(" ")]

	for (const sym of chosen) {
		if (sym === "ε") continue
		const { expression: subExpr, derivation: subDeriv } = derive(
			grammar,
			sym,
			maxDepth,
			depth + 1
		)
		expression += subExpr
		derivation.push(...subDeriv)
	}

	return { expression, derivation }
}

export function generateInvalid(validCases: TestCase[], count: number): TestCase[] {
	const cases: TestCase[] = []
	const mutations = ["insert", "delete", "swap", "duplicate"]

	for (let i = 0; i < count; i++) {
		const base = validCases[Math.floor(Math.random() * validCases.length)]
		const mutated = mutateExpression(base.expression)
		cases.push({
			id: validCases.length + i + 1,
			type: "invalid",
			expression: mutated.result,
			mutation: mutated.type,
		})
	}

	return cases
}

function mutateExpression(expr: string): { result: string; type: string } {
	const chars = expr.split("")
	const ops = ["+", "-", "*", "/", "%", "(", ")"]
	const mutationType = Math.random()

	if (mutationType < 0.3 && chars.length > 1) {
		// Delete random char
		const idx = Math.floor(Math.random() * chars.length)
		chars.splice(idx, 1)
		return { result: chars.join(""), type: "delete" }
	} else if (mutationType < 0.6) {
		// Insert random op
		const idx = Math.floor(Math.random() * (chars.length + 1))
		const op = ops[Math.floor(Math.random() * ops.length)]
		chars.splice(idx, 0, op)
		return { result: chars.join(""), type: "insert" }
	} else if (mutationType < 0.8 && chars.length > 1) {
		// Swap two chars
		const idx1 = Math.floor(Math.random() * chars.length)
		let idx2 = Math.floor(Math.random() * chars.length)
		while (idx2 === idx1) idx2 = Math.floor(Math.random() * chars.length)
		;[chars[idx1], chars[idx2]] = [chars[idx2], chars[idx1]]
		return { result: chars.join(""), type: "swap" }
	} else {
		// Duplicate part
		const start = Math.floor(Math.random() * chars.length)
		const len = Math.floor(Math.random() * (chars.length - start)) + 1
		const part = chars.slice(start, start + len)
		chars.splice(start + len, 0, ...part)
		return { result: chars.join(""), type: "duplicate" }
	}
}

export function generateExtreme(
	grammar: Grammar,
	count: number,
	maxDepth: number,
	maxLength: number
): TestCase[] {
	const cases: TestCase[] = []

	for (let i = 0; i < count; i++) {
		let expression = ""
		let attempts = 0
		while (expression.length < maxLength && attempts < 100) {
			const { expression: part } = derive(grammar, grammar.start, maxDepth)
			expression += part
			attempts++
		}
		cases.push({
			id: i + 1,
			type: "extreme",
			expression: expression.slice(0, maxLength),
		})
	}

	return cases
}

export function calculateMetrics(cases: TestCase[]): Metrics {
	const total = cases.length
	const valid = cases.filter(c => c.type === "valid").length
	const invalid = cases.filter(c => c.type === "invalid").length
	const extreme = cases.filter(c => c.type === "extreme").length

	const lengths = cases.map(c => c.expression.length)
	const avgLength = lengths.reduce((a, b) => a + b, 0) / total

	const depths = cases.filter(c => c.derivation).map(c => c.derivation!.length)
	const maxDepth = depths.length > 0 ? Math.max(...depths) : 0

	const operatorCounts: Record<string, number> = {}
	const ops = ["+", "-", "*", "/", "%"]
	for (const op of ops) {
		operatorCounts[op] = cases.reduce(
			(count, c) => count + (c.expression.split(op).length - 1),
			0
		)
	}

	const mutationLevels: Record<string, number> = {}
	cases
		.filter(c => c.mutation)
		.forEach(c => {
			mutationLevels[c.mutation!] = (mutationLevels[c.mutation!] || 0) + 1
		})

	return {
		totalGenerated: total,
		validCount: valid,
		invalidCount: invalid,
		extremeCount: extreme,
		validPercentage: (valid / total) * 100,
		invalidPercentage: (invalid / total) * 100,
		extremePercentage: (extreme / total) * 100,
		avgLength,
		maxDepth,
		operatorCounts,
		mutationLevels,
		avgExecutionTime: 0,
	}
}

export function exportToJSON(cases: TestCase[], metrics: Metrics): string {
	return JSON.stringify({ cases, metrics }, null, 2)
}

import { describe, it, expect } from "vitest"
import {
	parseGrammar,
	generateValid,
	generateInvalid,
	generateExtreme,
	calculateMetrics,
	exportToJSON,
} from "./grammar"

describe("parseGrammar", () => {
	it("should parse a simple grammar correctly", () => {
		const grammarText = `
		S -> E
		E -> E + T | T
		T -> T * F | F
		F -> ( E ) | id
		`
		const grammar = parseGrammar(grammarText)
		expect(grammar.start).toBe("S")
		expect(grammar.nonTerminals.has("S")).toBe(true)
		expect(grammar.nonTerminals.has("E")).toBe(true)
		expect(grammar.nonTerminals.has("T")).toBe(true)
		expect(grammar.nonTerminals.has("F")).toBe(true)
		expect(grammar.terminals.has("id")).toBe(true)
		expect(grammar.terminals.has("(")).toBe(true)
		expect(grammar.terminals.has(")")).toBe(true)
		expect(grammar.terminals.has("+")).toBe(true)
		expect(grammar.terminals.has("*")).toBe(true)
		expect(grammar.productions.get("S")).toEqual([["E"]])
		expect(grammar.productions.get("E")).toEqual([["E", "+", "T"], ["T"]])
		expect(grammar.productions.get("T")).toEqual([["T", "*", "F"], ["F"]])
		expect(grammar.productions.get("F")).toEqual([["(", "E", ")"], ["id"]])
	})

	it("should handle empty lines and comments", () => {
		const grammarText = `
		# This is a comment
		S -> a

		E -> b
		`
		const grammar = parseGrammar(grammarText)
		expect(grammar.start).toBe("S")
		expect(grammar.productions.get("S")).toEqual([["a"]])
		expect(grammar.productions.get("E")).toEqual([["b"]])
	})

	it("should parse complex grammar with multiple productions", () => {
		const grammarText = `
		S -> Expr
		Expr -> Expr + Term | Expr - Term | Term
		Term -> Term * Factor | Term / Factor | Factor
		Factor -> ( Expr ) | num | id
		`
		const grammar = parseGrammar(grammarText)
		expect(grammar.start).toBe("S")
		expect(grammar.terminals.has("num")).toBe(true)
		expect(grammar.terminals.has("id")).toBe(true)
		expect(grammar.terminals.has("+")).toBe(true)
		expect(grammar.terminals.has("-")).toBe(true)
		expect(grammar.terminals.has("*")).toBe(true)
		expect(grammar.terminals.has("/")).toBe(true)
		expect(grammar.productions.get("Expr")).toHaveLength(3)
		expect(grammar.productions.get("Term")).toHaveLength(3)
		expect(grammar.productions.get("Factor")).toHaveLength(3)
	})
})

describe("generateValid", () => {
	it("should generate valid expressions with different depths", () => {
		const grammar = parseGrammar("S -> a | S + S | ( S )")
		const cases1 = generateValid(grammar, 3, 1)
		const cases2 = generateValid(grammar, 3, 3)
		expect(cases1.length).toBe(3)
		expect(cases2.length).toBe(3)
		// Cases with higher depth should potentially be longer
		const avgLength1 =
			cases1.reduce((sum, c) => sum + c.expression.length, 0) / cases1.length
		const avgLength2 =
			cases2.reduce((sum, c) => sum + c.expression.length, 0) / cases2.length
		expect(avgLength2).toBeGreaterThanOrEqual(avgLength1)
		console.log("Valid cases depth 1:", cases1.map((c) => c.expression))
		console.log("Valid cases depth 3:", cases2.map((c) => c.expression))
	})

	it("should generate valid expressions for arithmetic grammar", () => {
		const grammarText = `
		S -> E
		E -> E + T | E - T | T
		T -> T * F | T / F | F
		F -> ( E ) | num
		`
		const grammar = parseGrammar(grammarText)
		const cases = generateValid(grammar, 5, 4)
		expect(cases.length).toBe(5)
		cases.forEach(case_ => {
			expect(case_.type).toBe("valid")
			expect(typeof case_.expression).toBe("string")
			expect(case_.expression.length).toBeGreaterThan(0)
			// Basic check: should contain only valid characters (including 'num')
			expect(
				/^[a-zA-Z0-9+\-*/() ]+$/.test(case_.expression.replace(/\s/g, ""))
			).toBe(true)
		})
	})
})

describe("generateInvalid", () => {
	it("should generate invalid cases from valid ones with various mutations", () => {
		const validCases = [
			{ id: 1, type: "valid" as const, expression: "a + b * c" },
			{ id: 2, type: "valid" as const, expression: "( x - y )" },
		]
		const invalidCases = generateInvalid(validCases, 6)
		expect(invalidCases.length).toBe(6)
		invalidCases.forEach(case_ => {
			expect(case_.type).toBe("invalid")
			expect(case_.mutation).toBeDefined()
		})
		// Should have different mutations
		const mutations = invalidCases.map(c => c.mutation)
		expect(new Set(mutations).size).toBeGreaterThan(1)
		console.log("Invalid cases:", invalidCases.map(c => ({ expression: c.expression, mutation: c.mutation })))
	})
})

describe("generateExtreme", () => {
	it("should generate extreme cases with high depth and length", () => {
		const grammar = parseGrammar("S -> a | S + S | S * S")
		const cases = generateExtreme(grammar, 3, 10, 50)
		expect(cases.length).toBe(3)
		cases.forEach(case_ => {
			expect(case_.type).toBe("extreme")
			expect(case_.expression.length).toBeGreaterThan(0)
		})
		// Check that some expressions are long
		const longExpressions = cases.filter(c => c.expression.length > 20)
		expect(longExpressions.length).toBeGreaterThan(0)
		console.log("Extreme cases:", cases.map(c => c.expression))
	})
})

describe("calculateMetrics", () => {
	it("should calculate metrics correctly with mixed cases", () => {
		const cases = [
			{ id: 1, type: "valid" as const, expression: "a + b" },
			{ id: 2, type: "valid" as const, expression: "x * y - z" },
			{ id: 3, type: "invalid" as const, expression: "a +" },
			{ id: 4, type: "invalid" as const, expression: "b *" },
			{ id: 5, type: "extreme" as const, expression: "a + b + c + d + e" },
			{ id: 6, type: "extreme" as const, expression: "((x))" },
		]
		const metrics = calculateMetrics(cases)
		expect(metrics.totalGenerated).toBe(6)
		expect(metrics.validCount).toBe(2)
		expect(metrics.invalidCount).toBe(2)
		expect(metrics.extremeCount).toBe(2)
		expect(metrics.validPercentage).toBeCloseTo(33.33, 1)
		expect(metrics.invalidPercentage).toBeCloseTo(33.33, 1)
		expect(metrics.extremePercentage).toBeCloseTo(33.33, 1)
		expect(metrics.avgLength).toBeCloseTo(7, 1)
		expect(metrics.maxDepth).toBe(0) // No derivations provided
		expect(metrics.operatorCounts["+"]).toBeGreaterThan(0)
		console.log("Metrics:", metrics)
	})

	it("should handle operator counts correctly", () => {
		const cases = [
			{ id: 1, type: "valid" as const, expression: "a + b - c * d / e" },
		]
		const metrics = calculateMetrics(cases)
		expect(metrics.operatorCounts["+"]).toBe(1)
		expect(metrics.operatorCounts["-"]).toBe(1)
		expect(metrics.operatorCounts["*"]).toBe(1)
		expect(metrics.operatorCounts["/"]).toBe(1)
	})
})

describe("exportToJSON", () => {
	it("should export to JSON format with complete data", () => {
		const cases = [
			{
				id: 1,
				type: "valid" as const,
				expression: "test",
				derivation: ["S -> test"],
			},
			{ id: 2, type: "invalid" as const, expression: "tes", mutation: "deletion" },
		]
		const metrics = {
			totalGenerated: 2,
			validCount: 1,
			invalidCount: 1,
			extremeCount: 0,
			validPercentage: 50,
			invalidPercentage: 50,
			extremePercentage: 0,
			avgLength: 3.5,
			maxDepth: 1,
			operatorCounts: { "+": 0 },
			mutationLevels: { deletion: 1 },
			avgExecutionTime: 5,
		}
		const json = exportToJSON(cases, metrics)
		expect(typeof json).toBe("string")
		const parsed = JSON.parse(json)
		expect(parsed.cases).toHaveLength(2)
		expect(parsed.metrics.totalGenerated).toBe(2)
	})
})

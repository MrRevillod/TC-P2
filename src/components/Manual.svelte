<div class="font-body min-h-screen bg-white p-6 text-black">
	<div class="mx-auto max-w-4xl">
		<header class="mb-8 border-b-2 border-black pb-4">
			<div class="mb-2 flex items-center justify-between">
				<h1 class="font-headline text-4xl font-bold text-black">
					Manual de Usuario
				</h1>
				<button
					onclick={() =>
						window.dispatchEvent(new CustomEvent("navigate", { detail: "home" }))}
					class="rounded-md border border-black bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-gray-800"
				>
					Volver al Inicio
				</button>
			</div>
			<p class="font-body text-lg italic text-gray-700">
				Guía completa para el Generador Automático de Casos de Prueba
			</p>
		</header>

		<div class="space-y-8">
			<section>
				<h2
					class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold"
				>
					Introducción
				</h2>
				<p class="leading-relaxed text-gray-700">
					Esta aplicación es una herramienta para generar casos de prueba automáticos
					a partir de gramáticas libres de contexto, enfocada específicamente en
					expresiones aritméticas. Permite crear casos válidos, inválidos y extremos
					para probar la robustez de aplicaciones que procesan expresiones
					matemáticas.
				</p>
			</section>

			<section>
				<h2
					class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold"
				>
					Cómo Usar la Aplicación
				</h2>

				<h3 class="mb-3 text-xl font-bold">1. Cargar una Gramática</h3>
				<p class="mb-4 text-gray-700">
					En la columna izquierda, puede cargar un archivo de gramática (.txt) o
					editar directamente la gramática en el área de texto. La aplicación incluye
					una gramática por defecto para expresiones aritméticas.
				</p>
				<div class="mb-4 rounded-md bg-gray-50 p-4">
					<p class="font-mono text-sm text-gray-800">
						E → E + T | E - T | T<br />
						T → T * F | T / F | T % F | F<br />
						F → ( E ) | num<br />
						num → 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
					</p>
				</div>

				<h3 class="mb-3 text-xl font-bold">2. Configurar Parámetros</h3>
				<p class="mb-4 text-gray-700">
					En la fila superior de configuraciones, ajuste los siguientes parámetros:
				</p>
				<ul class="mb-4 list-disc space-y-2 pl-6 text-gray-700">
					<li>
						<strong>Casos Válidos:</strong> Número de expresiones válidas a generar
					</li>
					<li>
						<strong>Casos Inválidos:</strong> Número de expresiones inválidas (con mutaciones)
					</li>
					<li>
						<strong>Casos Extremos:</strong> Número de casos extremos (expresiones muy
						largas o complejas)
					</li>
					<li>
						<strong>Profundidad Máxima:</strong> Máxima profundidad del árbol de derivación
					</li>
					<li>
						<strong>Longitud Máxima:</strong> Máxima longitud de las expresiones generadas
					</li>
				</ul>

				<h3 class="mb-3 text-xl font-bold">3. Generar Casos de Prueba</h3>
				<p class="mb-4 text-gray-700">
					Haga clic en el botón "Generar Casos" para crear los casos de prueba según
					los parámetros configurados. La aplicación mostrará métricas del proceso y
					los casos generados.
				</p>

				<h3 class="mb-3 text-xl font-bold">4. Revisar Resultados</h3>
				<p class="mb-4 text-gray-700">
					Los resultados se muestran en las columnas centrales:
				</p>
				<ul class="mb-4 list-disc space-y-2 pl-6 text-gray-700">
					<li><strong>Métricas:</strong> Estadísticas del proceso de generación</li>
					<li>
						<strong>Casos Generados:</strong> Lista de todas las expresiones creadas
					</li>
				</ul>

				<h3 class="mb-3 text-xl font-bold">5. Exportar Resultados</h3>
				<p class="mb-4 text-gray-700">
					Use el botón "Exportar JSON" para descargar un archivo con todos los casos
					generados y sus métricas.
				</p>
			</section>

			<section>
				<h2
					class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold"
				>
					Tipos de Casos Generados
				</h2>

				<div class="grid gap-6 md:grid-cols-3">
					<div class="rounded-md bg-green-50 p-4">
						<h4 class="mb-2 font-bold text-green-800">Casos Válidos</h4>
						<p class="text-sm text-green-700">
							Expresiones que siguen correctamente la gramática definida. Son casos
							normales que la aplicación debería procesar sin problemas.
						</p>
					</div>

					<div class="rounded-md bg-red-50 p-4">
						<h4 class="mb-2 font-bold text-red-800">Casos Inválidos</h4>
						<p class="text-sm text-red-700">
							Expresiones válidas que han sido modificadas con mutaciones
							intencionales para crear errores sintácticos o semánticos.
						</p>
					</div>

					<div class="rounded-md bg-yellow-50 p-4">
						<h4 class="mb-2 font-bold text-yellow-800">Casos Extremos</h4>
						<p class="text-sm text-yellow-700">
							Expresiones que prueban los límites del sistema: muy largas, muy
							profundas, o con combinaciones complejas de operadores.
						</p>
					</div>
				</div>
			</section>

			<section>
				<h2
					class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold"
				>
					Formato de Gramática
				</h2>
				<p class="mb-4 text-gray-700">
					Las gramáticas deben estar en formato BNF (Backus-Naur Form) con las
					siguientes reglas:
				</p>
				<ul class="mb-4 list-disc space-y-2 pl-6 text-gray-700">
					<li>Cada regla comienza con un símbolo no terminal seguido de →</li>
					<li>Los símbolos se separan con | para alternativas</li>
					<li>Los terminales pueden ser símbolos individuales o palabras</li>
					<li>Los espacios son ignorados (excepto dentro de terminales)</li>
				</ul>
				<div class="rounded-md bg-blue-50 p-4">
					<p class="mb-2 font-bold text-blue-800">Ejemplo:</p>
					<p class="font-mono text-sm text-blue-700">
						S → a S b | ε<br />
						(Esta gramática genera cadenas como: ε, ab, aabb, aaabbb, etc.)
					</p>
				</div>
			</section>

			<section>
				<h2
					class="font-headline mb-4 border-b border-gray-300 pb-2 text-2xl font-bold"
				>
					Solución de Problemas
				</h2>
				<div class="space-y-4">
					<div>
						<h4 class="mb-2 font-bold">Error al cargar gramática</h4>
						<p class="text-sm text-gray-700">
							Verifique que el archivo tenga extensión .txt y que la sintaxis BNF sea
							correcta. Los símbolos no terminales deben comenzar con mayúscula.
						</p>
					</div>
					<div>
						<h4 class="mb-2 font-bold">No se generan casos</h4>
						<p class="text-sm text-gray-700">
							Asegúrese de que la gramática esté cargada correctamente y que al menos
							un tipo de caso tenga un valor mayor a 0.
						</p>
					</div>
					<div>
						<h4 class="mb-2 font-bold">Expresiones muy largas</h4>
						<p class="text-sm text-gray-700">
							Reduzca la profundidad máxima o la longitud máxima para obtener
							expresiones más manejables.
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</div>

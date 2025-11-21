# Manual de Usuario

_Guía completa para el Generador Automático de Casos de Prueba_

## Introducción

Esta aplicación es una herramienta para generar casos de prueba automáticos a partir de gramáticas libres de contexto, enfocada específicamente en expresiones aritméticas. Permite crear casos válidos, inválidos y extremos para probar la robustez de aplicaciones que procesan expresiones matemáticas.

## Cómo Usar la Aplicación

### 1. Cargar una Gramática

En la columna izquierda, puede cargar un archivo de gramática (.txt) o editar directamente la gramática en el área de texto. La aplicación incluye una gramática por defecto para expresiones aritméticas.

```
E → E + T | E - T | T
T → T * F | T / F | T % F | F
F → ( E ) | num
num → 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
```

### 2. Configurar Parámetros

En la fila superior de configuraciones, ajuste los siguientes parámetros:

- **Casos Válidos:** Número de expresiones válidas a generar
- **Casos Inválidos:** Número de expresiones inválidas (con mutaciones)
- **Casos Extremos:** Número de casos extremos (expresiones muy largas o complejas)
- **Profundidad Máxima:** Máxima profundidad del árbol de derivación
- **Longitud Máxima:** Máxima longitud de las expresiones generadas

### 3. Generar Casos de Prueba

Haga clic en el botón "Generar Casos" para crear los casos de prueba según los parámetros configurados. La aplicación mostrará métricas del proceso y los casos generados.

### 4. Revisar Resultados

Los resultados se muestran en las columnas centrales:

- **Métricas:** Estadísticas del proceso de generación
- **Casos Generados:** Lista de todas las expresiones creadas

### 5. Exportar Resultados

Use el botón "Exportar JSON" para descargar un archivo con todos los casos generados y sus métricas.

## Tipos de Casos Generados

### Casos Válidos

Expresiones que siguen correctamente la gramática definida. Son casos normales que la aplicación debería procesar sin problemas.

### Casos Inválidos

Expresiones válidas que han sido modificadas con mutaciones intencionales para crear errores sintácticos o semánticos.

### Casos Extremos

Expresiones que prueban los límites del sistema: muy largas, muy profundas, o con combinaciones complejas de operadores.

## Formato de Gramática

Las gramáticas deben estar en formato BNF (Backus-Naur Form) con las siguientes reglas:

- Cada regla comienza con un símbolo no terminal seguido de →
- Los símbolos se separan con | para alternativas
- Los terminales pueden ser símbolos individuales o palabras
- Los espacios son ignorados (excepto dentro de terminales)

**Ejemplo:**

```
S → a S b | ε
```

(Esta gramática genera cadenas como: ε, ab, aabb, aaabbb, etc.)

## Solución de Problemas

### Error al cargar gramática

Verifique que el archivo tenga extensión .txt y que la sintaxis BNF sea correcta. Los símbolos no terminales deben comenzar con mayúscula.

### No se generan casos

Asegúrese de que la gramática esté cargada correctamente y que al menos un tipo de caso tenga un valor mayor a 0.

### Expresiones muy largas

Reduzca la profundidad máxima o la longitud máxima para obtener expresiones más manejables.

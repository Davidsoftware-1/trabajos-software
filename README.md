# trabajos-software
David Jeshuat López Hurtado


## Taller

## 1. Introducción
Los operadores en JavaScript son símbolos especiales que permiten realizar operaciones
sobre valores y variables. Son las herramientas fundamentales para manipular datos,
realizar cálculos matemáticos y establecer la lógica de control en un programa.
- Clasificación de Operadores
## A. Operadores Aritméticos


Operador Nombre Ejemplo Resultado (si x = 20)
+ Adición x + 5 25
- Sustracción x - 19
- Multiplicación x * 2 40
/ División x / 2 10
% Módulo (Resto) x % 3 1
** Exponenciación x ** 2 200
++ Incremento x++ 21

-- Decremento x-- 19


B. Operadores de Asignación
Permiten asignar valores a las variables, a menudo combinando una operación aritmética
con la asignación.
● Asignación estándar (## =## ):
let a = 10;
● Asigna suma (## +=## ):
a += 5;
(Equivale a a = a + 5 ## )
● Asignación de resta (## -=## ):
a -= 2;
(Equivale a
a = a - 2
## )
● Asignación de multiplicación (
## *=
## ):
a *= 3;
(Equivale a
a = a * 3
## )
C. Operadores de Comparación
Se utilizan para comparar dos valores y devuelven un valor booleano (
true
o
false
## ).
## ● Igualdad (
## ==
): Compara solo el valor (hace conversión de tipo).
● Igualdad estricta (
## ===
): Compara valor y tipo de dato (Recomendado).
● Desigualdad estricta (
## !==
): Verifica que los valores y tipos no sean iguales.
● Mayor que (## >) y Menor que (## <## ).
● Mayor o igual que (## >=) y Menor o igual que (## <=## ).
- Operador Ternario (Condicional)
Es una forma abreviada de escribir una estructura
if-else
. Es el único operador que
trabaja con tres partes:
## Estructura:
condición ? expresión_si_cierto : expresión_si_falso
## Ejemplo:
let resultado = (nota >= 5) ? "Aprobado" : "Suspendido";
El dominio de los operadores es esencial para cualquier desarrollador de JavaScript, ya que
permiten la manipulación fluida de datos y la creación de algoritmos complejos. Se
recomienda priorizar siempre el uso de operadores estrictos (## ===) para evitar errores de
tipado dinámico.

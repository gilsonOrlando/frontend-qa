interface Solucion {
    metrica: string;
    regla: string;
    recomendacion: string;
  }
  
  const soluciones: Solucion[] = [
    {
      metrica: "Complejidad cognitiva",
      regla: "Límite de Complejidad Cognitiva",
      recomendacion:
        "Por defecto, SonarQube establece que los métodos no deben tener una complejidad cognitiva mayor a 15. Superar este umbral indica que el método puede ser difícil de entender y mantener, lo que representa un riesgo para la calidad del código.",
    },
    {
      metrica: "Complejidad cognitiva",
      regla: "Refactorización Recomendada",
      recomendacion:
        "Cuando un método excede el límite de 15 en complejidad cognitiva, se recomienda refactorizar el código. Esto puede incluir dividir el método en funciones más pequeñas o simplificar la lógica para reducir la complejidad.",
    },
    {
      metrica: "Complejidad cognitiva",
      regla: "Evaluación de Estructuras de Control",
      recomendacion:
        "La complejidad cognitiva se incrementa por cada estructura de control que interrumpe el flujo lineal del código, como bucles (for, while) y condicionales (if, switch). Es importante minimizar el anidamiento de estas estructuras para mantener la claridad del código.",
    },
    {
      metrica: "Complejidad cognitiva",
      regla: "Incrementos por Anidamiento",
      recomendacion:
        "Cada vez que se anidan estructuras de control, se incrementa la complejidad cognitiva. Por lo tanto, es aconsejable evitar estructuras profundamente anidadas para facilitar la comprensión.",
    },
    {
      metrica: "Complejidad cognitiva",
      regla: "Uso de Comentarios",
      recomendacion:
        "Aunque no es una regla estricta, es recomendable documentar partes del código que tienen alta complejidad cognitiva con comentarios claros y concisos. Esto ayuda a otros desarrolladores a entender mejor la lógica detrás del código.",
    },
    {
      metrica: "Complejidad cognitiva",
      regla: "Evaluación Continua",
      recomendacion:
        "Se sugiere realizar análisis continuos del código utilizando SonarQube para monitorear la complejidad cognitiva a lo largo del tiempo y asegurarse de que los nuevos cambios no introduzcan una complejidad innecesaria.",
    },
    {
      metrica: "Complejidad cognitiva",
      regla: "Prácticas de Codificación Limpia",
      recomendacion:
        "Adoptar prácticas de codificación limpia, como seguir principios SOLID y mantener funciones cortas y enfocadas, puede ayudar a reducir la complejidad cognitiva en general.",
    },
    {
      metrica: "Densidad de comentarios",
      regla: "Debe haber una cantidad adecuada de comentarios",
      recomendacion:
        "Si la densidad de comentarios es demasiado baja (< 20%), es probable que el código no esté bien documentado, si es demasiado alta (> 50%), podría indicar un exceso de comentarios innecesarios.",
    },
    {
      metrica: "Densidad de comentarios",
      regla: "Evitar comentarios obsoletos o engañosos",
      recomendacion:
        "Los comentarios deben mantenerse actualizados y reflejar con precisión lo que hace el código y no deben contradecir la lógica del código.",
    },
    {
      metrica: "Densidad de comentarios",
      regla: "No comentar código innecesariamente",
      recomendacion:
        "El código debe ser lo suficientemente claro por sí mismo, sin necesidad de explicaciones redundantes y evitar comentarios que simplemente describan lo que ya es obvio.",
    },
    {
      metrica: "Densidad de comentarios",
      regla: "Usar comentarios para explicar la intención, no la implementación",
      recomendacion:
        "Explicar el por qué del código y no el cómo.",
    },
    {
      metrica: "Densidad de comentarios",
      regla: "Incluir comentarios en secciones clave del código",
      recomendacion:
        "Explicación de algoritmos complejos y documentación de funciones y clases importantes.",
    },
    {
      metrica: "Complejidad ciclomática",
      regla: "Mantener la complejidad por debajo de 10 por función o método",
      recomendacion:
        "Un valor entre 1 y 10 es aceptable, un valor entre 10 y 20 indica que el código es difícil de entender y un valor mayor a 20 sugiere que el código es complejo y debe refactorizarse.",
    },
    {
      metrica: "Complejidad ciclomática",
      regla: "Evitar funciones y métodos largos",
      recomendacion:
        "Máximo 30-50 líneas por función, Si una función tiene más de 10 decisiones (if, switch, for, while), es probable que necesite simplificación.",
    },
    {
      metrica: "Complejidad ciclomática",
      regla: "Reducir el uso excesivo de estructuras condicionales anidadas",
      recomendacion:
        "Evitar if dentro de if dentro de if y se prefiere estructuras más planas y claras.",
    },
    {
      metrica: "Complejidad ciclomática",
      regla: "Usar el principio de responsabilidad única (SRP)",
      recomendacion:
        "Cada función debe hacer solo una tarea específica, y si una función realiza múltiples tareas, divídela en funciones más pequeñas",
    },
    {
      metrica: "Complejidad ciclomática",
      regla: "Evitar switch con muchos casos",
      recomendacion:
        "Prefiere objetos o diccionarios para manejar múltiples opciones.",
    },
    {
      metrica: "Complejidad ciclomática",
      regla: "No usar más de 3 o 4 parámetros en una función.",
      recomendacion:
        "Muchas variables dificultan el mantenimiento y la legibilidad.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Extraer código duplicado en funciones reutilizables",
      recomendacion:
        "No copiar y pegar el mismo código en varias partes del programa.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Usar variables o constantes en lugar de valores mágicos",
      recomendacion:
        "Evitar valores duplicados en el código.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Crear componentes reutilizables en React/Vue",
      recomendacion:
        "No duplicar código en diferentes componentes.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Evitar duplicación de consultas SQL",
      recomendacion:
        "No escribir la misma consulta en diferentes partes del código",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Evitar duplicación en validaciones",
      recomendacion:
        "Centralizar validaciones en una función o middleware.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Utilizar herencia o composición en lugar de duplicar clases",
      recomendacion:
        "No copiar código en múltiples clases similares.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Evitar duplicación en configuraciones y constantes",
      recomendacion:
        "Centralizar configuraciones en archivos únicos",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Reemplazar estructuras repetitivas con map, filter o reduce",
      recomendacion:
        "No escribir múltiples if o switch para casos similares.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Evitar código duplicado en pruebas unitarias",
      recomendacion:
        "No repetir los mismos casos de prueba en varios archivos.",
    },
    {
      metrica: "Líneas duplicadas",
      regla: "Usar archivos de plantillas para HTML y CSS en lugar de repetir código",
      recomendacion:
        "No duplicar estructuras HTML y CSS.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Implementar pruebas unitarias para todas las funciones clave",
      recomendacion:
        "Cada función debe tener una prueba unitaria que valide su comportamiento.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Cobrir todos los flujos de control (if, else, switch, loops)",
      recomendacion:
        "Cada posible flujo de ejecución debe ser probado.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Evitar dependencias externas no controladas en pruebas",
      recomendacion:
        "No depender de APIs o bases de datos externas en pruebas unitarias.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Configurar cobertura mínima aceptable en SonarQube",
      recomendacion:
        "Definir un umbral mínimo de cobertura de pruebas (por ejemplo, 80%).",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Escribir pruebas para excepciones y errores",
      recomendacion:
        "Probar los casos donde el código lanza excepciones.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Usar pruebas de integración para componentes críticos",
      recomendacion:
        "Probar cómo interactúan los diferentes módulos.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Ejecutar pruebas automáticamente en cada commit (CI/CD)",
      recomendacion:
        "Automatizar pruebas con herramientas como GitHub Actions, Jenkins o GitLab CI/CD.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "No ignorar líneas de código importantes con /* istanbul ignore next",
      recomendacion:
        "No excluir partes críticas del código con comentarios de cobertura.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Utilizar pruebas E2E para validar flujos completos",
      recomendacion:
        "Verificar que la aplicación funcione correctamente en su totalidad.",
    },
    {
      metrica: "Líneas de cobertura",
      regla: "Mantener pruebas actualizadas con cada cambio en el código",
      recomendacion:
        " Si se cambia una función, actualizar sus pruebas.",
    },
  ];
  
  export default soluciones;
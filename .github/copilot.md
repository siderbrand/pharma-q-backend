# Copilot Guidelines — PharmaQ Backend

Este documento define las reglas, estándares y lineamientos que deben seguirse al generar código para el backend del proyecto **PharmaQ**.

El objetivo es asegurar:
- Código limpio y mantenible
- Separación clara de responsabilidades
- Uso de arquitectura desacoplada (Adapter / Hexagonal Architecture)
- Buenas prácticas de seguridad
- Documentación consistente con Swagger

---

##  Arquitectura

Se utilizará **Adapter Architecture (Hexagonal Architecture)**.

### Capas del sistema

1. **Domain**
   - Entidades del negocio
   - Interfaces (ports)
   - Lógica de negocio pura
   - NO depende de frameworks

2. **Application**
   - Casos de uso (use cases)
   - Orquesta la lógica del dominio
   - Define contratos de entrada/salida

3. **Infrastructure**
   - Implementaciones concretas (DB, APIs externas)
   - Adaptadores
   - ORM / acceso a datos

4. **Interface (Controllers)**
   - Exposición HTTP (NestJS Controllers)
   - Validación de entrada
   - Manejo de respuestas

---

##  Estructura de carpetas esperada

```bash
src/
  patients/
    domain/
      entities/
      interfaces/
    application/
      use-cases/
      dto/
    infrastructure/
      persistence/
      repositories/
    interface/
      controllers/
      dto/
```

---

##  Clean Code

### Reglas generales

- Nombres descriptivos (NO abreviaciones innecesarias)
- Funciones pequeñas (máx ~20 líneas)
- Una sola responsabilidad por función/clase
- Evitar lógica en controladores
- Evitar lógica en repositorios
- La lógica vive en **use cases**

---

##  Comentarios

### IMPORTANTE

- ❌ NO usar comentarios inline (`// comentario`)
- ✅ Usar comentarios por bloques

### Formato obligatorio

```ts
/**
 * Describe claramente qué hace este bloque
 * Explica decisiones importantes si las hay
 */
```

- Comentar:
  - Casos de uso
  - Métodos importantes
  - Reglas de negocio
- NO comentar cosas obvias

---

##  API REST

### Convenciones

- Uso correcto de métodos HTTP:
  - GET → consultar
  - POST → crear
  - PATCH → actualizar parcial
  - DELETE → eliminar

- Respuestas claras y consistentes

### Ejemplo esperado

```ts
GET /patients/{document}
```

---

##  DTOs

- Usar DTOs para entrada y salida
- Validaciones con `class-validator`
- NO exponer entidades directamente

---

##  Swagger

Toda la API debe estar documentada con Swagger.

### Reglas

- Cada endpoint debe tener:
  - `@ApiOperation`
  - `@ApiResponse`
  - `@ApiParam` (si aplica)

### Ejemplo

```ts
@ApiOperation({ summary: 'Consultar paciente por documento' })
@ApiResponse({ status: 200, description: 'Paciente encontrado' })
@ApiResponse({ status: 404, description: 'Paciente no encontrado' })
```

---

##  Manejo de errores

- Usar excepciones de NestJS:
  - `NotFoundException`
  - `BadRequestException`
- NO retornar errores manuales en JSON

### Regla clave

Si el paciente no existe → lanzar `NotFoundException`

---

##  Seguridad

- Validar siempre los inputs
- Nunca confiar en datos del cliente
- Sanitizar entradas si aplica
- Preparado para futura autenticación (JWT)

---

##  Testing 

- Diseñar código testeable desde el inicio
- Evitar dependencias acopladas
- Usar interfaces para repositorios


---

## 🎯 Qué debe hacer la IA

Cuando genere código:

1. Respetar la arquitectura definida
2. Crear:
   - Controller
   - Use Case
   - Interface de repositorio
   - Implementación mock o básica
3. Incluir Swagger
4. Incluir validaciones
5. Usar comentarios por bloques
6. Mantener separación de capas

---

##  Qué NO debe hacer la IA

- Meter lógica en controllers
- Acceder directamente a DB desde controller
- Usar comentarios inline
- Ignorar Swagger
- Mezclar responsabilidades
- Crear código monolítico

---

##  Resultado esperado

Código:
- Modular
- Escalable
- Testeable
- Claro
- Documentado
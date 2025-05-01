# 🧩 PuppetAI Markdown DSL v1 — Full Specification

## 📜 Overview

This DSL is a **Markdown-native scripting language** for AI workflows.  
It enables structured automation across tools like Puppeteer, image generators,
or language models using:

- ✅ Markdown for documentation
- ✅ Fenced code blocks (` ```tool `) to define logic
- ✅ Minimal syntax: `@use`, `@each`, and plugin calls
- ✅ A shared `ExecutionContext` carrying state between tools

---

## 📦 Core Concepts

### 📁 Script file structure

A script is a `.md` or `.mdx` file composed of:

- 📝 **Text blocks** — human-readable documentation
- 🔧 **Code blocks** — DSL instructions, prefixed by tool names:

  `````markdown
  ````puppet
  ...commands

  \```
  ````
  `````

  ```

  ```

---

## 🧠 Memory Model

The runtime manages:

- `executionContext.state`: a shared structured data object across all tools
- A **memory pointer** (active `@use` target)
- Optional scoped variables via loop (`@each`) or interpolation (`{{var}}`)

---

## 🧩 Instructions

### ✅ `@use`

Sets or focuses the memory pointer.

#### Forms:

```txt
@use key                # focus pointer (read/write)
@use key = value        # assign and point
@use key = y.z          # deep copy from existing path
@use key = [a, b]       # array from other keys
@use key = {a, img:b}   # object with optional aliasing
```

#### Behavior:

- Mutates `context.state.key`
- All plugin output writes to the current pointer

---

### ✅ `@each`

Loops over an array in the context.

```txt
@each item in list
  <plugin calls using {{item}}>
@end
```

- `item` is a scoped variable available via `{{item}}`
- The memory pointer stays unchanged inside loop

---

### ✅ Plugin calls

All plugin calls begin with `@` and follow this form:

```txt
@pluginName/arg
@pluginName/{{contextVar}}
@org/namespace/arg
```

#### Rules:

There are two king of plugins: First class, and org plugin

`@filter` is a first class plugin, while `@robusta/genImage` is an org plugin

So `@filter/2` will execute with `2` as arg, while `@robusta/genImage/haiku`
will execute with `haiku` as prompt

The slash `/` after the plugin name totally facultative and can be replaced by
spaces. So `@filter 2` and `@robusta/genImage haiku` are equivalent.

However `@robusta genImage haiku` will result in an error as the plugin name is
not valid (To be in fact challenged !)

- The **first slash** separates plugin name from its argument
- Only one argument is supported per call in v1
- Use `@pluginName` with interpolation to pass dynamic values

#### Examples:

```txt
@filter/5                  # pass static arg "5"
@filter/{{myNumber}}       # pass dynamic value from context
@orderBy/default           # order by default logic
@robusta/genImage/haiku    # custom plugin
```

---

## 📊 Data Flow Example

````markdown
```puppet
@use suggestions = ["haiku", "sunset", "frog"]

@use images = []
@each topic in suggestions
  @robusta/imageGen topic "poetic art for {{topic}}"
@end

@use count = 2
@use preview = @filter/{{count}}
```
````

Results in:

```json
{
  "data": {
    "suggestions": [...],
    "images": [...],
    "count": 2,
    "preview": [ ... ]
  }
}
```

---

## 🧰 ExecutionContext (simplified)

```ts
interface ExecutionContext {
  data: Record<string, any>
  meta: {
    history: ActionLog[]
    errors: string[]
    warnings: string[]
    [key: string]: any
  }
}
```

---

## 🧪 Summary of Keywords

| Keyword     | Purpose                          |
| ----------- | -------------------------------- |
| `@use`      | Set memory pointer and/or assign |
| `@each`     | Loop over array                  |
| `@plugin/x` | Invoke plugin with 1 argument    |

---

## 🛡 Security + Limits

- No raw JS allowed in v1
- Only string/array/object literals, context lookups, and plugin args
- Future versions may support: `@let`, `@if`, `@elseif`, `@else`, `@eval`

---

## 📌 Best Practices

- Declare all data sources with `@use`
- Prefer `{{var}}` for readable interpolation
- Keep plugin logic composable and pure

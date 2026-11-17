# VueQuill 1.5.1 scoped lifecycle correction (LT576)

Copied from the locked installed vue-quill 1.5.1 package: plugin entry,
Quill component, imported GrammarlyInline format, and actual LICENSE.
The package metadata says ISC; the shipped license is MIT and is retained here.
Only semantic change: the mounted nextTick callback returns when toolbar=false
produces no .ql-toolbar. Toolbar-enabled composers keep the original behavior.
No dependency files under node_modules are patched. All other consumers retain
the same globally registered component and filters.

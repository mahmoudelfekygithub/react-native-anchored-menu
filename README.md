# react-native-anchored-menu

A **headless, scoped, anchored menu / popover system for React Native** that works reliably across:
- normal screens
- FlatList / ScrollView
- native Modal(s)
- Android & iOS
- optional React Native Navigation (RNN)

This library focuses on **correct structure first**, not just visuals.

---

## Why this library exists

Most context-menu / popover libraries break when:
- used inside a native `<Modal>`
- used inside `FlatList`
- running on Android (coordinate mismatch)
- multiple menus exist at the same time

`react-native-anchored-menu` solves this by introducing **scoped hosts** and **host-relative positioning**.

> Menus render **only inside the layer you mount them in** — never magically above it.

---

## Core Concepts

### 1️⃣ Anchor
Any view you want to attach a menu to.

### 2️⃣ Scope
A logical layer (e.g. `root`, `modal-1`, `modal-2`).
- Root scope → normal app screens
- Modal scope → menus inside a specific native modal

### 3️⃣ Host
A renderer that lives **inside a scope** and is responsible for:
- measuring anchors
- positioning menus
- dismissing on outside press

You never render above a modal unless you explicitly mount a scope inside it.

---

## Installation

```bash
npm install react-native-anchored-menu
# or
yarn add react-native-anchored-menu
```

No native linking required.

---

## Basic Usage (Root Scope)

Wrap your app **once**.

```jsx
import { AnchoredMenuProvider } from "react-native-anchored-menu";

export default function Root() {
  return (
    <AnchoredMenuProvider>
      <App />
    </AnchoredMenuProvider>
  );
}
```

That’s it.  
The root host is mounted automatically.

---

## Creating an Anchor

```jsx
import { MenuAnchor } from "react-native-anchored-menu";

<MenuAnchor id="profile-menu">
  <Button title="Open menu" />
</MenuAnchor>
```

⚠️ `id` must be unique **within its scope**.

---

## Opening a Menu

```js
import { useAnchoredMenu } from "react-native-anchored-menu";

const { open } = useAnchoredMenu();

open({
  id: "profile-menu",
  placement: "auto",
  render: ({ close }) => (
    <View>
      <Pressable onPress={close}>
        <Text>Edit</Text>
      </Pressable>
    </View>
  ),
});
```

---

## Using Inside a Native Modal (Important)

If you want menus **inside a native `<Modal>`**, you MUST mount a scope inside that modal.

```jsx
import { AnchoredMenuScope } from "react-native-anchored-menu";

<Modal visible transparent>
  <AnchoredMenuScope scopeId="modal-1">
    <ModalContent />
  </AnchoredMenuScope>
</Modal>
```

Then use anchors normally inside:

```jsx
<MenuAnchor id="modal-menu">
  <Button title="More" />
</MenuAnchor>
```

Menus will now:
- render above modal content
- dismiss correctly
- position correctly on Android

---

## Auto-Dismiss on Scroll (Recommended)

Menus should close when scrolling.

```js
const { getDismissOnScrollProps } = useAnchoredMenu();

<FlatList
  {...getDismissOnScrollProps()}
  data={data}
  renderItem={renderItem}
/>
```

This automatically closes the menu on:
- scroll begin
- momentum scroll
- scroll end

---

## API Reference

### `<AnchoredMenuProvider />`
Root provider. Mount once.

**Props**
- `Navigation?` → required only if using RNN overlays

---

### `<AnchoredMenuScope />`
Creates a scoped layer (usually inside a modal).

**Props**
- `scopeId` (string, required)

---

### `<MenuAnchor />`
Registers an anchor.

**Props**
- `id` (string, required)
- `scopeId?` (string, optional – inferred from nearest scope)

---

### `useAnchoredMenu()`

```ts
const {
  open,
  close,
  isOpen,
  getDismissOnScrollProps,
} = useAnchoredMenu();
```

---

### `open(options)`

```ts
open({
  id: string,
  scopeId?: string,
  placement?: "auto" | "top" | "bottom",
  offset?: number,
  margin?: number,
  align?: "start" | "center" | "end",
  animationType?: "fade" | "none",
  statusBarTranslucent?: boolean,
  render?: ({ close, anchor }) => ReactNode,
  content?: ReactNode,
});
```

---

## Android Notes

- Uses **stable multi-frame measurement** to avoid `y=0` bugs.
- Converts window → host coordinates internally.
- No hardcoded toolbar or status bar offsets.

---

## Design Philosophy

- **Structure over hacks**
- **No magic rendering above native layers**
- **Headless UI** – you own the design
- **Deterministic behavior** across platforms

---

## When NOT to use this library

- If you want a simple dropdown with no modals
- If you expect menus to appear above native modals automatically
- If you don’t want to think about layers/scopes

---

## License

MIT © Your Name

---

## Contributing

PRs and discussions are welcome.  
If you find a structural edge case, please include:
- platform
- whether a native Modal was involved
- scope setup

# React + TypeScript + Vite + shadcn/ui

This is a template for a new Vite project with React, TypeScript, and shadcn/ui.

## SmartFan MQTT integration

The dashboard connects to HiveMQ over WebSockets at
`ws://broker.hivemq.com:8000/mqtt`, subscribes to
`sic/smartfan/telemetry`, and publishes selected operating modes to
`sic/smartfan/cmd/mode`.

Telemetry messages are JSON objects with the following fields:

```json
{
  "mode": "AUTO",
  "temp": 29.5,
  "hum": 65,
  "speed": 80,
  "dist": [45, 102, 23],
  "fan": [true, true, false]
}
```

The MQTT client reconnects automatically, ignores malformed telemetry, and
shows unavailable values until valid telemetry is received.

## Adding components

To add components to your app, run the following command:

```bash
npx shadcn@latest add button
```

This will place the ui components in the `src/components` directory.

## Using components

To use the components in your app, import them as follows:

```tsx
import { Button } from "@/components/ui/button"
```

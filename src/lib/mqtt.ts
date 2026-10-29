import mqtt, { type MqttClient } from "mqtt"
import { useCallback, useEffect, useRef, useState } from "react"

const MQTT_URL = "wss://broker.hivemq.com:8884/mqtt"
const TELEMETRY_TOPIC = "sic/smartfan/telemetry"
const COMMAND_TOPIC = "sic/smartfan/cmd/mode"

export type Mode = "AUTO" | "MANUAL" | "OFF"
export type ConnectionStatus =
  "connecting" | "connected" | "reconnecting" | "disconnected" | "error"

export type Telemetry = {
  mode: Mode | null
  temp: number | null
  hum: number | null
  speed: number | null
  dist: [number | null, number | null, number | null]
  fan: [boolean | null, boolean | null, boolean | null]
}

type TelemetryUpdate = Partial<Omit<Telemetry, "dist" | "fan">> & {
  dist?: [number | null, number | null, number | null]
  fan?: [boolean | null, boolean | null, boolean | null]
}

export const initialTelemetry: Telemetry = {
  mode: null,
  temp: null,
  hum: null,
  speed: null,
  dist: [null, null, null],
  fan: [null, null, null],
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function readNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function readMode(value: unknown): Mode | null {
  return value === "AUTO" || value === "MANUAL" || value === "OFF"
    ? value
    : null
}

function readFanStatus(value: unknown): boolean | null {
  if (typeof value === "boolean") {
    return value
  }

  if (typeof value === "number") {
    return value !== 0
  }

  if (typeof value === "string") {
    const normalized = value.toUpperCase()
    if (normalized === "ON" || normalized === "1" || normalized === "TRUE") {
      return true
    }
    if (normalized === "OFF" || normalized === "0" || normalized === "FALSE") {
      return false
    }
  }

  return null
}

function readArray<T>(
  value: unknown,
  reader: (item: unknown) => T | null
): [T | null, T | null, T | null] | null {
  if (!Array.isArray(value)) {
    return null
  }

  return [reader(value[0]), reader(value[1]), reader(value[2])]
}

function parseTelemetry(payload: Uint8Array): TelemetryUpdate | null {
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(payload))
    if (!isRecord(parsed)) {
      return null
    }

    const update: TelemetryUpdate = {}
    if ("mode" in parsed) update.mode = readMode(parsed.mode)
    if ("temp" in parsed) update.temp = readNumber(parsed.temp)
    if ("hum" in parsed) update.hum = readNumber(parsed.hum)
    if ("speed" in parsed) update.speed = readNumber(parsed.speed)

    const distances = readArray(parsed.dist, readNumber)
    if (distances) update.dist = distances

    const fanStatuses = readArray(parsed.fan, readFanStatus)
    if (fanStatuses) update.fan = fanStatuses

    return update
  } catch {
    return null
  }
}

export function useMqtt() {
  const clientRef = useRef<MqttClient | null>(null)
  const [telemetry, setTelemetry] = useState(initialTelemetry)
  const [status, setStatus] = useState<ConnectionStatus>("connecting")
  const [telemetryWarning, setTelemetryWarning] = useState<string | null>(null)

  useEffect(() => {
    const client = mqtt.connect(MQTT_URL, {
      reconnectPeriod: 3000,
      connectTimeout: 10000,
      clean: true,
    })
    clientRef.current = client

    const handleConnect = () => {
      setStatus("connected")
      client.subscribe(TELEMETRY_TOPIC, (error) => {
        if (error) {
          setStatus("error")
          setTelemetryWarning("Unable to subscribe to telemetry.")
        }
      })
    }

    const handleMessage = (_topic: string, payload: Uint8Array) => {
      const update = parseTelemetry(payload)
      if (!update) {
        setTelemetryWarning("Received invalid telemetry.")
        return
      }

      setTelemetry((current) => ({ ...current, ...update }))
      setTelemetryWarning(null)
    }

    const handleError = () => {
      setStatus("error")
    }

    const handleReconnect = () => {
      setStatus("reconnecting")
    }

    const handleClose = () => {
      setStatus("disconnected")
    }

    client.on("connect", handleConnect)
    client.on("message", handleMessage)
    client.on("error", handleError)
    client.on("reconnect", handleReconnect)
    client.on("close", handleClose)

    return () => {
      client.removeListener("connect", handleConnect)
      client.removeListener("message", handleMessage)
      client.removeListener("error", handleError)
      client.removeListener("reconnect", handleReconnect)
      client.removeListener("close", handleClose)
      client.end(true)
      clientRef.current = null
    }
  }, [])

  const publishMode = useCallback((mode: Mode) => {
    const client = clientRef.current
    if (!client || !client.connected) {
      setTelemetryWarning("Cannot change mode while MQTT is disconnected.")
      return
    }

    client.publish(COMMAND_TOPIC, mode, (error) => {
      if (error) {
        setTelemetryWarning("Unable to publish the selected mode.")
      }
    })
  }, [])

  return { telemetry, status, telemetryWarning, publishMode }
}

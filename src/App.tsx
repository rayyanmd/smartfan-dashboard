import { DropletsIcon, FanIcon, ThermometerIcon } from "lucide-react"
import { Separator } from "./components/ui/separator"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Badge } from "./components/ui/badge"
import { Button } from "./components/ui/button"
import { type Mode, useMqtt } from "./lib/mqtt"

const modeLabels: Record<Mode, string> = {
  AUTO: "Auto",
  MANUAL: "Manual",
  OFF: "Off",
}

function formatValue(value: number | null, suffix = "") {
  return value === null ? "--" : `${value}${suffix}`
}

function formatFanStatus(value: boolean | null) {
  return value === null ? "Unavailable" : value ? "ON" : "OFF"
}

export function App() {
  const { telemetry, status, telemetryWarning, publishMode } = useMqtt()
  const connectionLabel = {
    connecting: "Connecting",
    connected: "Connected",
    reconnecting: "Reconnecting",
    disconnected: "Disconnected",
    error: "Connection error",
  }[status]
  const connectionVariant =
    status === "connected"
      ? "default"
      : status === "error"
        ? "destructive"
        : "secondary"

  const handleModeChange = (mode: Mode) => {
    publishMode(mode)
  }

  return (
    <div className="space-y-4 p-4">
      <div>
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-4xl font-bold">Smart Fan</h1>
          <Badge variant={connectionVariant}>{connectionLabel}</Badge>
        </div>
        <h2 className="text-lg">IoT Monitoring & Control System</h2>
        {telemetryWarning && (
          <p className="text-sm text-destructive">{telemetryWarning}</p>
        )}
      </div>
      <Separator />
      <div className="flex flex-col space-y-4 space-x-4 md:flex-row md:space-y-0">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex">
              <ThermometerIcon className="mr-1" /> Temperature
            </CardTitle>
            <CardDescription>Room temperature.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl">
            {formatValue(telemetry.temp, "°C")}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex">
              <DropletsIcon className="mr-1" /> Humidity
            </CardTitle>
            <CardDescription>Room humidity.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl">
            {formatValue(telemetry.hum, "%")}
          </CardContent>
        </Card>
      </div>
      <Separator />
      <div className="flex items-center justify-between">
        <h2>Fan Control</h2>
        <span className="text-sm text-gray-500">
          Speed: {formatValue(telemetry.speed, "%")}
        </span>
      </div>
      <div className="flex flex-col space-y-4 space-x-4 sm:flex-row sm:space-y-0">
        <Card className="w-full">
          <CardHeader className="flex items-center">
            <CardTitle className="flex">
              <FanIcon className="mr-1" /> Fan 1
            </CardTitle>
            {/* <Badge variant={telemetry.fan[0] ? "default" : "outline"}>
              {formatFanStatus(telemetry.fan[0])}
            </Badge> */}
          </CardHeader>
          <CardContent>
            <Badge variant={telemetry.fan[0] ? "default" : "destructive"}>
              {formatFanStatus(telemetry.fan[0])}
            </Badge>
            {/* <Button disabled={telemetry.fan[0] === null}>
              {telemetry.fan[0] ? "Turn Off" : "Turn On"}
            </Button> */}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex items-center">
            <CardTitle className="flex">
              <FanIcon className="mr-1" /> Fan 2
            </CardTitle>
            {/* <Badge variant={telemetry.fan[1] ? "default" : "outline"}>
              {formatFanStatus(telemetry.fan[1])}
            </Badge> */}
          </CardHeader>
          <CardContent>
            <Badge variant={telemetry.fan[1] ? "default" : "destructive"}>
              {formatFanStatus(telemetry.fan[1])}
            </Badge>
            {/* <Button disabled={telemetry.fan[1] === null}>
              {telemetry.fan[1] ? "Turn Off" : "Turn On"}
            </Button> */}
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex items-center">
            <CardTitle className="flex">
              <FanIcon className="mr-1" /> Fan 3
            </CardTitle>
            {/* <Badge variant={telemetry.fan[2] ? "default" : "destructive"}>
              {formatFanStatus(telemetry.fan[2])}
            </Badge> */}
          </CardHeader>
          <CardContent>
            <Badge variant={telemetry.fan[2] ? "default" : "destructive"}>
              {formatFanStatus(telemetry.fan[2])}
            </Badge>
            {/* <Button disabled={telemetry.fan[2] === null}>
              {telemetry.fan[2] ? "Turn Off" : "Turn On"}
            </Button> */}
          </CardContent>
        </Card>
      </div>
      <Separator />
      <h2>Operating Mode</h2>
      <div className="flex space-x-2">
        {(["AUTO", "MANUAL", "OFF"] as const).map((mode) => (
          <Button
            className="flex-auto"
            key={mode}
            variant={telemetry.mode === mode ? "default" : "secondary"}
            onClick={() => handleModeChange(mode)}
          >
            {modeLabels[mode]}
          </Button>
        ))}
      </div>
      <p className="text-sm text-gray-500">
        Current mode:{" "}
        {telemetry.mode ? modeLabels[telemetry.mode] : "Unavailable"}
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Distance Sensors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Zone 1</TableCell>
                <TableCell>{formatValue(telemetry.dist[0], " cm")}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      telemetry.dist[0] === null
                        ? "outline"
                        : telemetry.dist[0] < 50
                          ? "outline"
                          : "default"
                    }
                  >
                    {telemetry.dist[0] === null
                      ? "Unavailable"
                      : telemetry.dist[0] < 50
                        ? "Detected"
                        : "Clear"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Zone 2</TableCell>
                <TableCell>{formatValue(telemetry.dist[1], " cm")}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      telemetry.dist[1] === null
                        ? "outline"
                        : telemetry.dist[1] < 50
                          ? "outline"
                          : "default"
                    }
                  >
                    {telemetry.dist[1] === null
                      ? "Unavailable"
                      : telemetry.dist[1] < 50
                        ? "Detected"
                        : "Clear"}
                  </Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Zone 3</TableCell>
                <TableCell>{formatValue(telemetry.dist[2], " cm")}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={
                      telemetry.dist[2] === null
                        ? "outline"
                        : telemetry.dist[2] < 50
                          ? "outline"
                          : "default"
                    }
                  >
                    {telemetry.dist[2] === null
                      ? "Unavailable"
                      : telemetry.dist[2] < 50
                        ? "Detected"
                        : "Clear"}
                  </Badge>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Separator />
      <p className="text-center text-sm text-gray-400">
        bebas deh - Samsung Innovation Campus - IPB University
      </p>
    </div>
  )
}

export default App

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

export function App() {
  return (
    <div className="space-y-4 p-4">
      <div>
        <h1 className="text-4xl font-bold">Smart Fan</h1>
        <h2 className="text-lg">IoT Monitoring & Control System</h2>
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
          <CardContent className="text-4xl">29.5°C</CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex">
              <DropletsIcon className="mr-1" /> Humidity
            </CardTitle>
            <CardDescription>Room humidity.</CardDescription>
          </CardHeader>
          <CardContent className="text-4xl">65%</CardContent>
        </Card>
      </div>
      <Separator />
      <h2>Fan Control</h2>
      <div className="flex flex-col space-y-4 space-x-4 sm:flex-row sm:space-y-0">
        <Card className="w-full">
          <CardHeader className="flex items-center">
            <CardTitle className="flex">
              <FanIcon className="mr-1" /> Fan 1
            </CardTitle>
            <Badge variant="default">ON</Badge>
          </CardHeader>
          <CardContent>
            <Button>Turn Off</Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex items-center">
            <CardTitle className="flex">
              <FanIcon className="mr-1" /> Fan 2
            </CardTitle>
            <Badge variant="default">ON</Badge>
          </CardHeader>
          <CardContent>
            <Button>Turn Off</Button>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader className="flex items-center">
            <CardTitle className="flex">
              <FanIcon className="mr-1" /> Fan 3
            </CardTitle>
            <Badge variant="destructive">OFF</Badge>
          </CardHeader>
          <CardContent>
            <Button>Turn On</Button>
          </CardContent>
        </Card>
      </div>
      <Separator />
      <h2>Operating Mode</h2>
      <div className="flex space-x-2">
        <Button className="flex-auto" variant="secondary">
          Auto
        </Button>
        <Button className="flex-auto">Manual</Button>
        <Button className="flex-auto" variant="secondary">
          Off
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Distance Sensors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Zone 1</TableCell>
                <TableCell>45 cm</TableCell>
                <TableCell className="text-right">
                  <Badge>Detected</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Zone 2</TableCell>
                <TableCell>102 cm</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline">Clear</Badge>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Zone 3</TableCell>
                <TableCell>23 cm</TableCell>
                <TableCell className="text-right">
                  <Badge>Detected</Badge>
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
